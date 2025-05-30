import jwt from "jsonwebtoken";

export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded as { id: string; email: string; username: string };
    } catch (error) {
        console.error(error);
        return null;
    }
}