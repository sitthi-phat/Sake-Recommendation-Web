import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
    const session = await getServerSession(authOptions);

    // 1. Authorization Check (Must be logged in to register/check)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { path } = await context.params;
    const backendPath = path.join('/'); // e.g. "check" or "register"
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:4000';

    try {
        const body = await request.json();

        // 2. Call Backend with Secret
        const res = await fetch(`${backendUrl}/api/auth/${backendPath}`, {
            method: 'POST',
            headers: {
                'x-api-secret': process.env.API_SECRET || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Backend unavailable' }, { status: 500 });
    }
}
