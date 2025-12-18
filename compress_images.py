#!/usr/bin/env python3
"""
Compress large images before uploading to Cloudinary
"""
from PIL import Image
import os

IMAGES_TO_COMPRESS = [
    'reviews1.jpg',
    'mh5.jpg',
    'mh3.jpg',
    'mh1.jpg',
    'mh4.jpg'
]

def compress_image(input_path, max_size_mb=9):
    """Compress image to under max_size_mb"""
    
    # Open image
    img = Image.open(input_path)
    
    # Convert to RGB if necessary
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    # Get original size
    original_size = os.path.getsize(input_path) / (1024 * 1024)
    
    # Calculate max dimensions (reduce to 70% if needed)
    max_dimension = 2400
    if img.width > max_dimension or img.height > max_dimension:
        ratio = max_dimension / max(img.width, img.height)
        new_size = (int(img.width * ratio), int(img.height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Start with quality 85 and reduce until size is acceptable
    quality = 85
    temp_path = input_path + '.temp'
    
    while quality > 40:
        img.save(temp_path, 'JPEG', quality=quality, optimize=True)
        compressed_size = os.path.getsize(temp_path) / (1024 * 1024)
        
        if compressed_size < max_size_mb:
            break
        
        quality -= 5
    
    # Replace original with compressed
    os.replace(temp_path, input_path)
    
    final_size = os.path.getsize(input_path) / (1024 * 1024)
    
    return original_size, final_size, quality

def main():
    print("🗜️  Compressing large images...")
    print("=" * 60)
    
    base_path = '/workspaces/Solomon-s-Landing/website'
    
    for image in IMAGES_TO_COMPRESS:
        filepath = os.path.join(base_path, image)
        
        if not os.path.exists(filepath):
            print(f"⚠️  {image} not found, skipping...")
            continue
        
        print(f"\n📦 Compressing {image}...")
        
        try:
            original, final, quality = compress_image(filepath)
            reduction = ((original - final) / original) * 100
            
            print(f"   ✅ Success!")
            print(f"   📊 Original: {original:.1f} MB")
            print(f"   📊 Final: {final:.1f} MB")
            print(f"   📉 Reduction: {reduction:.1f}%")
            print(f"   🎨 Quality: {quality}%")
            
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
    
    print("\n" + "=" * 60)
    print("✨ Compression complete!")

if __name__ == "__main__":
    main()
