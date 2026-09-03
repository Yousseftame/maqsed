import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Extract IP from standard reverse proxy headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  const ip = forwardedFor?.split(',')[0] || realIp || 'Unknown IP';
  
  return NextResponse.json({ ip });
}
