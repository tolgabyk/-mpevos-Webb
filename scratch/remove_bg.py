from PIL import Image

def remove_background(input_path, output_path, tolerance=50):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()

    new_data = []
    # Assuming the top-left pixel is the background color, usually black or white
    bg_color = data[0]
    
    for item in data:
        # Check if the pixel color is close to the background color
        if (abs(item[0] - bg_color[0]) < tolerance and 
            abs(item[1] - bg_color[1]) < tolerance and 
            abs(item[2] - bg_color[2]) < tolerance):
            # Change the target pixel to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_background('/Users/tolgabiyik/Desktop/Projeler/impevos/impevos_logo.PNG', '/Users/tolgabiyik/Desktop/Projeler/impevos/client/public/logo.png', tolerance=25)
