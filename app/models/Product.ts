import mongoose, { Schema, model, models } from "mongoose";

// app/models/Product.ts
const ProductSchema = new Schema({
    description: { type: String, required: true },
    brand: { type: String, required: true }, // Добавили
    img: { type: String, required: true },
    basePrice: { type: Number, required: true },
    oldPrice: { type: Number },              // Добавили
    sizes: { type: [String], default: [] },  // Добавили
    categories: { type: [String], default: [] },
}, { timestamps: true });

// Если модель уже создана, используем ее, иначе создаем новую
const Product = models.Product || model("Product", ProductSchema);

export default Product;