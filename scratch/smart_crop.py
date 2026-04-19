from PIL import Image

def color_distance(c1, c2):
    return abs(c1[0]-c2[0]) + abs(c1[1]-c2[1]) + abs(c1[2]-c2[2])

def smart_crop_and_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    width, height = img.size

    bg_color = data[0] # Top left pixel is background
    
    min_x, min_y = width, height
    max_x, max_y = 0, 0
    has_content = False

    new_data = []

    for y in range(height):
        for x in range(width):
            pixel = data[y * width + x]
            # Check if pixel is different from bg
            if color_distance(pixel, bg_color) > 30 and pixel[3] > 10:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                has_content = True
                new_data.append(pixel)
            else:
                # Make background transparent
                new_data.append((255, 255, 255, 0))

    if has_content:
        # Apply the transparent background
        img.putdata(new_data)
        
        # Crop directly to content
        padding = 10
        min_x = max(0, min_x - padding)
        min_y = max(0, min_y - padding)
        max_x = min(width, max_x + padding)
        max_y = min(height, max_y + padding)
        
        cropped_img = img.crop((min_x, min_y, max_x, max_y))
        cropped_img.save(output_path, "PNG")
        print(f"Removed BG and Cropped tightly to: ({min_x}, {min_y}, {max_x}, {max_y})")
    else:
        print("No content found!")

if __name__ == "__main__":
    smart_crop_and_transparent('/Users/tolgabiyik/Desktop/Projeler/impevos/impevos_logo.PNG', '/Users/tolgabiyik/Desktop/Projeler/impevos/client/public/logo.png')
