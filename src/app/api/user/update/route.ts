import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/user.model";

export async function PUT(req: Request) {
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

    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
    }

    const formData = await req.formData();
    const username = formData.get("username")?.toString() || "";
    const bio = formData.get("bio")?.toString() || "";
    let avatarUrl = "";

    const file = formData.get("avatar") as File | null;

    if (file && typeof file === "object") {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed" }, { status: 415 });
      }

      if (file.size > 30 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 30MB)" }, { status: 413 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${uuidv4()}-${file.name}`;

      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      avatarUrl = `/uploads/${filename}`;
    }

    type UpdateFields = Partial<{
      username: string;
      bio: string;
      avatar: string;
    }>;

    const updatedFields: UpdateFields = {
      username,
      bio,
    };

    if (avatarUrl) {
      updatedFields.avatar = avatarUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.id, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
