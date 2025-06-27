import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user.model";
import { RegisterSchema } from "@/validators/auth";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.safeParse(body);

    
    // Error Handling 
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { username, email, password } = validated.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username or email already in use." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
