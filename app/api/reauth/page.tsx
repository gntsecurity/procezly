'use client';
import { useState } from 'react';

export default function ReauthPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const sendReauthLink = async () => {
        const res = await fetch('/api/send-reauth-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setMessage(data.message || data.error);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Reauthenticate</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded mb-4"
            />
            <button onClick={sendReauthLink} className="bg-blue-600 text-white px-4 py-2 rounded">
                Send Reauth Link
            </button>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
