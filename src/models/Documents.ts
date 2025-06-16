import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISharedWith {
  user: Types.ObjectId;
  role: "viewer" | "editor";
}

export interface IDocument extends Document {
  title: string;
  content: string;
  owner: Types.ObjectId;
  sharedWith: ISharedWith[];
  publicAccess: boolean;
  publicRole: "viewer" | "editor";
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["viewer", "editor"],
          default: "viewer",
        },
      },
    ],
    publicAccess: {
      type: Boolean,
      default: false,
    },
    publicRole: {
      type: String,
      enum: ["viewer", "editor"],
      default: "viewer",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDocument>("Document", DocumentSchema);
