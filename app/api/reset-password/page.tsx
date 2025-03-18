'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async () => {
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Password updated successfully! You can now log in.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
            <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded mb-4"
            />
            <button onClick={handleResetPassword} className="bg-green-600 text-white px-4 py-2 rounded">
                Reset Password
            </button>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
