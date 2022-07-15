import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const jwt: string | undefined = req.cookies.jwt;

  if (!jwt) {
    return new Response(JSON.stringify({ message: 'Not authenticated.' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return NextResponse.next();
}