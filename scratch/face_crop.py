import cv2
import os

def face_crop_square(image_path, output_path, padding_factor=0.8, v_offset=0.45, h_offset=0.5):
    # Load the image
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not load image {image_path}")
        return

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Load Haar Cascade
    cascade_path = os.path.join(cv2.data.haarcascades, 'haarcascade_frontalface_default.xml')
    face_cascade = cv2.CascadeClassifier(cascade_path)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    img_h, img_w = img.shape[:2]

    if len(faces) == 0:
        print(f"No faces detected in {image_path}. Using center square crop.")
        size = min(img_h, img_w)
        x1 = (img_w - size) // 2
        y1 = (img_h - size) // 2
        x2 = x1 + size
        y2 = y1 + size
        cropped = img[y1:y2, x1:x2]
    else:
        (x, y, w, h) = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)[0]
        face_center_x = x + w // 2
        face_center_y = y + h // 2
        
        crop_size = int(max(w, h) * (1.0 + padding_factor * 2))
        crop_size = min(crop_size, img_h, img_w)

        x1 = max(0, face_center_x - int(crop_size * h_offset))
        y1 = max(0, face_center_y - int(crop_size * v_offset)) 
        
        x2 = x1 + crop_size
        y2 = y1 + crop_size
        
        if x2 > img_w:
            x2 = img_w
            x1 = x2 - crop_size
        if y2 > img_h:
            y2 = img_h
            y1 = y2 - crop_size
        if x1 < 0:
            x1 = 0
            x2 = x1 + crop_size
        if y1 < 0:
            y1 = 0
            y2 = y1 + crop_size

        cropped = img[y1:y2, x1:x2]

    final_size = 512
    resized = cv2.resize(cropped, (final_size, final_size), interpolation=cv2.INTER_LANCZOS4)
    
    cv2.imwrite(output_path, resized)
    print(f"Successfully cropped {image_path} -> {output_path} (v_offset={v_offset}, h_offset={h_offset}, padding={padding_factor})")

if __name__ == "__main__":
    base_dir = "/Users/tolgabiyik/Desktop/Projeler/impevos/client/public/team/"
    
    # Timur needs a tighter crop and to be shifted to the right to avoid the person on the left
    # h_offset=0.4 means the face center is at 40% from the left (shifting the crop right)
    face_crop_square(os.path.join(base_dir, "timur_ceyhan.jpeg"), os.path.join(base_dir, "timur_ceyhan.jpeg"), 
                     padding_factor=0.6, v_offset=0.35, h_offset=0.4)
