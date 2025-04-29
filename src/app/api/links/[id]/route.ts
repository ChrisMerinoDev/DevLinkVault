import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { verifyToken } from "@/lib/auth";
import Link from "@/models/link.model";

// Helper to verify token and get user ID
async function authenticateUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return { error: "Invalid token", status: 401 };
  }

  return { userId: decoded.id };
}

// PUT: Update link
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; // <-- await here
  
    const auth = await authenticateUser(req);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
  
    try {
      await connectToDatabase();
      const { title, url } = await req.json();
  
      const updated = await Link.findOneAndUpdate(
        { _id: id, user: auth.userId },
        { title, url },
        { new: true }
      );
  
      if (!updated) {
        return NextResponse.json({ error: "Link not found or not yours" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Link updated", link: updated }, { status: 200 });
    } catch (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
  
  // DELETE: Remove link
  export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; // <-- await here
  
    const auth = await authenticateUser(req);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
  
    try {
      await connectToDatabase();
  
      const deleted = await Link.findOneAndDelete({
        _id: id,
        user: auth.userId,
      });
  
      if (!deleted) {
        return NextResponse.json({ error: "Link not found or not yours" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Link deleted" }, { status: 200 });
    } catch (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
