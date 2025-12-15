// models/User.ts
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    // Мы будем использовать email как уникальный идентификатор (логин)
    email: {
        type: String,
        required: [true, "Пожалуйста, введите email"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    // Хешированный пароль
    password: {
        type: String,
        required: [true, "Пожалуйста, введите пароль"],
        // В продакшене не стоит выбирать пароль, но для NextAuth это может быть полезно
        select: false,
    },
    name: {
        type: String,
        required: [true, "Пожалуйста, введите имя"],
        trim: true,
    },
    // Можно добавить другие поля: роли, адрес и т.д.
}, { timestamps: true });

// Проверка: если модель 'User' уже существует, используем ее; иначе создаем новую.
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;