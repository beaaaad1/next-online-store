// app/auth/register/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Успешная регистрация, перенаправляем на страницу входа
                alert('Регистрация успешна! Теперь вы можете войти.');
                router.push('/auth/login');
            } else {
                setError(data.message || 'Ошибка регистрации.');
            }
        } catch (err) {
            console.error(err);
            setError('Произошла ошибка сети.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="p-8 border rounded shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Регистрация</h1>

                {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Имя</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

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
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>

                <p className="mt-4 text-center">
                    Уже есть аккаунт? <a href="/auth/login" className="text-blue-500 hover:underline">Войти</a>
                </p>
            </form>
        </div>
    );
}