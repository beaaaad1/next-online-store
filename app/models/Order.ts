import mongoose, { Schema, Document, Types } from "mongoose";

interface OrderItem {
    productId: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;

}

// Интерфейс для документа заказа
export interface IOrder extends Document {
    userId: Types.ObjectId; // Ссылка на пользователя
    items: OrderItem[];     // Список товаров в заказе
    totalAmount: number;    // Общая стоимость заказа
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: string;
}

const OrderItemSchema = new Schema<OrderItem>({
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }, // Ссылка на оригинальный товар
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});


const OrderSchema = new Schema<IOrder>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    shippingAddress: {
        type: String,
        required: false,
    }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;