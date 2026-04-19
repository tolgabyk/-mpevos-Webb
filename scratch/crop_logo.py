from PIL import Image

def process_logo(input_path, output_path, tolerance=10):
    img = Image.open(input_path).convert("RGBA")
    
    # Check if we need to make anything transparent (if background is white/black)
    # The image user showed seems to ALREADY have a transparent background, but with huge whitespace.
    # Let's crop to bounding box of non-transparent areas.
    
    # get bounding box of non-zero alpha
    bbox = img.getbbox()
    if bbox:
        # Crop to the exact logo pixels
        cropped_img = img.crop(bbox)
        cropped_img.save(output_path, "PNG")
        print("Cropped successfully to:", bbox)
    else:
        print("Could not find non-transparent pixels, saving original.")
        img.save(output_path, "PNG")

if __name__ == "__main__":
    process_logo('/Users/tolgabiyik/Desktop/Projeler/impevos/impevos_logo.PNG', '/Users/tolgabiyik/Desktop/Projeler/impevos/client/public/logo.png')
