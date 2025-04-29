import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { verifyToken } from "@/lib/auth";
import Link from "@/models/link.model";


// Create a new Link
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401});
        }

        const { title, url } = await req.json();

        if (!title || !url) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await connectToDatabase();

        const newLink = await Link.create({
            user: decoded.id,
            title,
            url,
        });

        return NextResponse.json({ message: "Link created", link: newLink}, { status: 201 });
    } catch (error) {
        console.error("Link creation error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// Get/fetch all links
export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        if (!decoded) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
    
        await connectToDatabase();

        const userLinks = await Link.find({ user: decoded.id }).sort({ createdAt: -1 });

        return NextResponse.json({ links: userLinks }, { status: 200 });
    } catch (error) {
        console.error("Link fetch error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

