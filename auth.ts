// lib/auth.ts (Исправленный код)

// ИМПОРТ ИЗ next-auth
import { getServerSession } from "next-auth";

// ИМПОРТ НАШЕЙ КОНФИГУРАЦИИ
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Функция для получения объекта сессии на стороне сервера
 */
export async function getSession() {
  // Вызываем getServerSession и передаем ему нашу конфигурацию
  return await getServerSession(authOptions);
}