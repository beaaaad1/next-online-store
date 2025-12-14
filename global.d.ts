// global.d.ts

import { Mongoose } from 'mongoose';

// Определяем кастомный тип для глобального кэша Mongoose
declare global {
  // Определяем структуру, которую мы храним в global.mongoose
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

// Этот экспорт обязателен, чтобы TypeScript интерпретировал файл как модуль
export {};