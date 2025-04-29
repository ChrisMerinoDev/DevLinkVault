import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILink extends Document {
    user: Types.ObjectId;
    title: string;
    url: string;
    createdAt: Date;
}

const LinkSchema = new Schema<ILink>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        url: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.link || mongoose.model<ILink>("Link", LinkSchema);