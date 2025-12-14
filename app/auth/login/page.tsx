"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
        });

        setLoading(false);

        if (result?.error) {

            setError(result.error);
        } else if (result?.ok) {

            router.push('/');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="p-8 border rounded shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Вход</h1>

                {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">Ошибка: {error}</div>}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>

                <p className="mt-4 text-center">
                    Нет аккаунта? <a href="/auth/register" className="text-green-500 hover:underline">Зарегистрироваться</a>
                </p>
            </form>
        </div>
    );
}