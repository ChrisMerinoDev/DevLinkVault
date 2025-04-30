import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import cloudinary from "@/lib/cloudinary";
import User from "@/models/user.model";

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
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
    const file = formData.get("avatar") as File | null;

    let avatarUrl = "";

    if (file) {
      // ✅ Check file size before processing (limit: 30MB)
      if (file.size > 30 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 30MB)" }, { status: 413 });
      }

      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Upload to Cloudinary using base64
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "devlinkvault_avatars",
        public_id: `user-${decoded.id}`,
        overwrite: true,
      });

      avatarUrl = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        username,
        bio,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
      { new: true }
    );

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
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
