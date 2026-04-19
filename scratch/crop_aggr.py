from PIL import Image

def aggressive_crop(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    width, height = img.size

    # Find bounding box of pixels that are NOT transparent and NOT pure white/black background
    min_x, min_y = width, height
    max_x, max_y = 0, 0

    has_content = False
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = data[y * width + x]
            # Ignore pixels with low alpha
            if a > 10:
                # Update box
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                has_content = True

    if has_content:
        # Add a tiny 20px padding
        padding = 20
        min_x = max(0, min_x - padding)
        min_y = max(0, min_y - padding)
        max_x = min(width, max_x + padding)
        max_y = min(height, max_y + padding)
        
        cropped_img = img.crop((min_x, min_y, max_x, max_y))
        cropped_img.save(output_path, "PNG")
        print(f"Cropped to ({min_x}, {min_y}, {max_x}, {max_y})")
    else:
        print("No content found!")

if __name__ == "__main__":
    aggressive_crop('/Users/tolgabiyik/Desktop/Projeler/impevos/impevos_logo.PNG', '/Users/tolgabiyik/Desktop/Projeler/impevos/client/public/logo.png')
