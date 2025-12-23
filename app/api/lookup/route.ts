import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// This is a Server-Side Route
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag');

  if (!tag) {
    return NextResponse.json({ success: false, message: 'Tag required' }, { status: 400 });
  }

  try {
    const targetUrl = `https://insmask.com/?p=${tag}`;
    
    // 1. Fetch HTML with User-Agent spoofing
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Referer': 'https://google.com'
      }
    });

    // 2. Parse HTML
    const $ = cheerio.load(response.data);
    
    // 3. Extract Data (Selectors need to be adjusted based on actual Insmask structure)
    // Heuristic: Look for the main profile container. 
    // Usually these sites have a class like 'profile-header', 'user-info', or simply use meta tags.
    
    let avatarUrl = '';
    let bio = '';
    let followerCount = '0';
    let handle = tag;

    // Try finding image
    const imgEl = $('img.user-img').first() || $('.profile-img img').first();
    if (imgEl.length) {
        avatarUrl = imgEl.attr('src') || '';
    }

    // Try finding bio
    const bioEl = $('.user-bio').first() || $('.description').first();
    if (bioEl.length) {
        bio = bioEl.text().trim();
    }

    // Try finding followers
    // Often formatted as "123 Followers" or inside a stats list
    const statsText = $('body').text();
    const followerMatch = statsText.match(/(\d+[k|m]?) followers/i);
    if (followerMatch) {
        followerCount = followerMatch[1];
    } else {
        // Fallback selector search
        const followerEl = $('.followers-count').first();
        if (followerEl.length) followerCount = followerEl.text().trim();
    }
    
    // Validation: If no avatar, likely failed or private/empty
    if (!avatarUrl && !bio) {
        // Fallback for private profiles: sometimes the image is still visible in specific container
        // If really nothing, return error
        return NextResponse.json({ success: false, message: 'Profile not found or hidden' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        handle,
        avatarUrl,
        bio: bio || "No biography.",
        followerCount
      }
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch profile' }, { status: 500 });
  }
}
