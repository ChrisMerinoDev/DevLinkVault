import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "@/models/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { LoginSchema } from "@/validators/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = LoginSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { error: "Invalid input", issues: validated.error.flatten() },
                { status: 400 }
            );
        }

        const { email, password } = validated.data;

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                username: user.username,

            },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}