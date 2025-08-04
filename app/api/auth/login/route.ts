import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Mock authentication - accept any email with password "admin123" 
    // or admin@operiq.com with any password
    if (
      (email === 'admin@operiq.com' && password) ||
      (email && password === 'admin123')
    ) {
      // Create a simple session token
      const sessionToken = Buffer.from(JSON.stringify({
        email,
        name: 'Administrador',
        role: 'admin',
        timestamp: Date.now()
      })).toString('base64');

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('session-token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });

      return NextResponse.json({
        success: true,
        user: {
          email,
          name: 'Administrador',
          role: 'admin'
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Credenciales incorrectas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}