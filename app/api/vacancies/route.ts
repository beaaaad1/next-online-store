
import { NextResponse } from 'next/server';

import vacanciesData from '@/migrations/mockVacancies.json';

export async function GET() {
    try {
        return NextResponse.json(vacanciesData, { status: 200 });

    } catch (error) {
        console.error("Ошибка при получении данных вакансий:", error);
        return NextResponse.json(
            { message: "Ошибка сервера при получении вакансий" },
            { status: 500 }
        );
    }
}