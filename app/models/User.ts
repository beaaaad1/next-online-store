import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "Пожалуйста, введите email"],
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Пожалуйста, введите пароль"],
        select: false,
    },
    name: {
        type: String,
        required: [true, "Пожалуйста, введите имя"],
        trim: true,
    },

}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;