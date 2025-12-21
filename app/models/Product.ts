import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
    {
        description: { type: String, required: true }, // Название товара
        img: { type: String, required: true },         // Ссылка на картинку
        basePrice: { type: Number, required: true },   // Цена
        discountPercent: { type: Number, default: 0 }, // Процент скидки
        categories: { type: [String], default: [] },   // Массив категорий
        rating: {
            rate: { type: Number, default: 5 },
            count: { type: Number, default: 0 }
        },
    },
    { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;