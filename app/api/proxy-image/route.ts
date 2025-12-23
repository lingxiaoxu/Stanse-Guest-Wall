import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL required', { status: 400 });
  }

  try {
    // Fetch the image as a stream/arraybuffer
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Referer': 'https://insmask.com/', // The Key: Pretend we are Insmask
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Determine content type
    const contentType = response.headers['content-type'] || 'image/jpeg';

    // Return the image data
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable' // Cache for performance
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    // Return a 1x1 transparent pixel or generic error placeholder if failed
    return new NextResponse('Error fetching image', { status: 502 });
  }
}
