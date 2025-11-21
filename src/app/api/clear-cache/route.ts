import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { type, path: cachePath, tag } = await request.json();

    switch (type) {
      case 'all':
        // Clear Next.js cache directory
        await clearNextCache();
        // Revalidate all paths
        revalidatePath('/', 'layout');
        break;
        
      case 'path':
        if (cachePath) {
          revalidatePath(cachePath);
        }
        break;
        
      case 'tag':
        if (tag) {
          // pass a profile string as the first argument as required by the revalidateTag signature
          revalidateTag('default', tag);
        }
        break;
        
      case 'images':
        await clearImageCache();
        break;
        
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid cache type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${type} cache cleared successfully`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

async function clearNextCache() {
  const cacheDir = path.join(process.cwd(), '.next/cache');
  
  if (fs.existsSync(cacheDir)) {
    // Hapus isi cache directory
    const files = fs.readdirSync(cacheDir);
    
    for (const file of files) {
      const filePath = path.join(cacheDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    }
  }
}

async function clearImageCache() {
  const imageCacheDir = path.join(process.cwd(), '.next/cache/images');
  
  if (fs.existsSync(imageCacheDir)) {
    fs.rmSync(imageCacheDir, { recursive: true, force: true });
  }
}