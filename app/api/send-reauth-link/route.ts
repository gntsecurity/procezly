import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    const { email } = await req.json();

    // Send magic link for reauthentication
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Reauthentication link sent to your email' });
}
