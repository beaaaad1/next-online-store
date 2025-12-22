import { getDB } from "@/api-routes";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json([], { status: 200 });
        }

        const db = await getDB();
        const userRole = (session.user as any).role;

        if (userRole === "admin") {
            const { searchParams } = new URL(req.url);
            const targetUserId = searchParams.get("userId");

            if (targetUserId) {
                const messages = await db.collection("messages")
                    .find({ userId: targetUserId })
                    .sort({ createdAt: 1 })
                    .toArray();
                return NextResponse.json(messages);
            }

            const chats = await db.collection("messages").aggregate([
                { $sort: { createdAt: -1 } },
                {
                    $group: {
                        _id: "$userId",
                        lastMessage: { $first: "$text" },
                        lastDate: { $first: "$createdAt" }
                    }
                },
                { $sort: { lastDate: -1 } }
            ]).toArray();

            return NextResponse.json(chats);
        }

        const messages = await db.collection("messages")
            .find({ userId: session.user.email })
            .sort({ createdAt: 1 })
            .toArray();

        return NextResponse.json(messages);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { text, userId: adminTargetId } = await req.json();
        if (!text) return NextResponse.json({ error: "No text" }, { status: 400 });

        const db = await getDB();
        const userRole = (session.user as any).role;

        if (userRole === "admin" && adminTargetId) {
            const adminMessage = {
                userId: adminTargetId,
                text: text,
                isAdmin: true,
                createdAt: new Date(),
            };
            await db.collection("messages").insertOne(adminMessage);
            return NextResponse.json(adminMessage);
        }

        const userMessage = {
            userId: session.user.email,
            text: text,
            isAdmin: false,
            createdAt: new Date(),
        };

        await db.collection("messages").insertOne(userMessage);
        return NextResponse.json(userMessage);
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}