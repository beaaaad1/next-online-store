import { NextResponse } from "next/server";
import connectToDatabase from "@/mongodb";
import Product from "@/app/models/Product";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const { description, brand, basePrice, oldPrice, img, sizes, categories, discountPercent } = body;

        const newProduct = await Product.create({
            description,
            brand,
            basePrice,
            oldPrice,
            img,
            sizes,
            categories,
            discountPercent
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        console.error("Ошибка при создании товара:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}