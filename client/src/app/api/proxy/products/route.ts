import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const guest = searchParams.get('guest');

    // 1. Authorization Check (Must be logged in OR be a guest)
    if (!session && !guest) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Prepare Query for Backend
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:4000';
    // Forward all search params
    const queryString = searchParams.toString();

    try {
        // 3. Call Backend with Secret
        const res = await fetch(`${backendUrl}/api/products?${queryString}`, {
            headers: {
                'x-api-secret': process.env.API_SECRET || '',
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Backend unavailable' }, { status: 500 });
    }
}
