import { NextResponse } from 'next/server';
import { supabase } from '/lib/supabase';

export async function POST(req: Request) {
    const { email } = await req.json();

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://your-procezly-app.com/auth/reset-password',
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Password reset email sent' });
}
