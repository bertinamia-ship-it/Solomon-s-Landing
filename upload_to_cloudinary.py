#!/usr/bin/env python3
"""
Script to upload images to Cloudinary and generate optimized URLs
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

# Images to upload (excluding logos which are already optimized)
IMAGES = [
    'reviews1.jpg',
    'mh5.jpg',
    'mh3.jpg',
    'mh1.jpg',
    'mh4.jpg',
    'sh4.jpg',
    'mh2.jpg',
    'sh1.jpg',
    'sh2.jpg',
    'sh3.jpg'
]

def upload_images():
    """Upload all images to Cloudinary with optimization"""
    results = {}
    
    print("🚀 Starting upload to Cloudinary...")
    print("=" * 60)
    
    for image in IMAGES:
        filepath = f'/workspaces/Solomon-s-Landing/website/{image}'
        
        if not os.path.exists(filepath):
            print(f"⚠️  {image} not found, skipping...")
            continue
        
        # Get file size before upload
        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        
        print(f"\n📤 Uploading {image} ({size_mb:.1f} MB)...")
        
        try:
            # Upload with optimization
            response = cloudinary.uploader.upload(
                filepath,
                folder="solomons-landing",
                public_id=image.replace('.jpg', '').replace('.png', ''),
                overwrite=True,
                resource_type="image",
                # Optimization settings
                quality="auto:good",
                fetch_format="auto"
            )
            
            # Generate optimized URL with transformations
            optimized_url = cloudinary.CloudinaryImage(response['public_id']).build_url(
                transformation=[
                    {'quality': 'auto:good'},
                    {'fetch_format': 'auto'}
                ]
            )
            
            results[image] = {
                'original_size': f"{size_mb:.1f} MB",
                'cloudinary_url': response['secure_url'],
                'optimized_url': optimized_url,
                'public_id': response['public_id']
            }
            
            print(f"   ✅ Success!")
            print(f"   📊 Original: {size_mb:.1f} MB")
            print(f"   🔗 URL: {optimized_url}")
            
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            results[image] = {'error': str(e)}
    
    print("\n" + "=" * 60)
    print("✨ Upload complete!")
    
    # Save results to JSON file
    with open('/workspaces/Solomon-s-Landing/cloudinary_urls.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📝 Results saved to cloudinary_urls.json")
    
    return results

if __name__ == "__main__":
    results = upload_images()
    
    print("\n" + "=" * 60)
    print("📋 SUMMARY:")
    print("=" * 60)
    
    successful = sum(1 for r in results.values() if 'error' not in r)
    failed = sum(1 for r in results.values() if 'error' in r)
    
    print(f"✅ Successful uploads: {successful}")
    print(f"❌ Failed uploads: {failed}")
    print(f"📦 Total images processed: {len(results)}")
