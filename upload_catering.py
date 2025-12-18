#!/usr/bin/env python3
"""
Script to upload catering images to Cloudinary with AI enhancement
"""
import cloudinary
import cloudinary.uploader
import os
import json

# Configure Cloudinary
cloudinary.config(
    cloud_name="dpmozdkfh",
    api_key="159722641187121",
    api_secret="NO-XAc4ikqKN5Vm1r08NS5ItYRg"
)

# Catering images to upload
CATERING_IMAGES = [
    'catering-1.jpg',
    'catering-2.jpg',
    'catering-3.jpg',
    'catering-4.jpg',
    'catering-5.jpg',
    'catering-6.jpg'
]

def upload_catering_images():
    """Upload all catering images to Cloudinary with AI enhancement and optimization"""
    results = {}
    
    print("🚀 Starting upload to Cloudinary with AI enhancement...")
    print("=" * 60)
    
    for image in CATERING_IMAGES:
        filepath = f'/workspaces/Solomon-s-Landing/website/{image}'
        
        if not os.path.exists(filepath):
            print(f"⚠️  {image} not found, skipping...")
            continue
        
        # Get file size before upload
        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        
        print(f"\n📤 Uploading {image} ({size_mb:.1f} MB)...")
        
        try:
            # Upload with AI enhancement for better quality
            response = cloudinary.uploader.upload(
                filepath,
                folder="solomons-landing",
                public_id=image.replace('.jpg', ''),
                overwrite=True,
                resource_type="image",
                # AI enhancements
                transformation=[
                    {'effect': 'sharpen:100'},  # Sharpen image
                    {'effect': 'auto_contrast'},  # Auto contrast
                    {'effect': 'auto_brightness'},  # Auto brightness
                    {'quality': 'auto:best'}  # Best quality
                ]
            )
            
            # Generate optimized URL
            optimized_url = f"https://res.cloudinary.com/dpmozdkfh/image/upload/q_auto:good/f_auto/solomons-landing/{image.replace('.jpg', '')}"
            
            results[image] = {
                'url': response['secure_url'],
                'optimized_url': optimized_url,
                'size': response['bytes'],
                'public_id': response['public_id']
            }
            
            print(f"✅ {image} uploaded successfully!")
            print(f"   Original size: {size_mb:.1f} MB")
            print(f"   Cloudinary URL: {optimized_url}")
            
        except Exception as e:
            print(f"❌ Error uploading {image}: {str(e)}")
            results[image] = {'error': str(e)}
    
    # Save results to JSON
    with open('cloudinary_catering_urls.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n" + "=" * 60)
    print("✨ Upload complete! URLs saved to cloudinary_catering_urls.json")
    print("\n📋 Optimized URLs:")
    for image, data in results.items():
        if 'optimized_url' in data:
            print(f"   {image}: {data['optimized_url']}")

if __name__ == "__main__":
    upload_catering_images()
