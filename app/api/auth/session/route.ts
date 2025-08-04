import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session-token');

  if (!sessionToken) {
    return NextResponse.json({ user: null });
  }

  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionToken.value, 'base64').toString()
    );
    
    return NextResponse.json({
      user: {
        email: sessionData.email,
        name: sessionData.name,
        role: sessionData.role
      }
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}