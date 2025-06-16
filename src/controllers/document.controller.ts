import { Request, Response } from "express";
import Documents from "../models/Documents";
import mongoose from "mongoose";
import User from "../models/User";

export const createDoc = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.owner) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const { title, content, sharedWith = [], role, owner } = req.body;

    const doc = await Documents.create({
      title,
      content,
      owner,
      sharedWith: sharedWith.map((userId: string) => ({
        user: userId,
        role,
      })),
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error("Create Doc Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getMyDocs = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const docs = await Documents.find({ owner: userId });
    res.json(docs);
  } catch (error) {
    console.error("Get My Docs Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getSharedDocs = async (req: Request, res: Response) => {
  try {
    const userId = req.params;
    const docs = await Documents.find({ "sharedWith.user": userId });
    res.json(docs);
  } catch (error) {
    console.error("Get Shared Docs Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateDoc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updated = await Documents.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Update Doc Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getDocumentByDocumentId = async (req: Request, res: Response) => {
  try {
    const { docId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(docId)) {
      res.status(400).json({ message: "Invalid document ID" });
    }

    const document = await Documents.findById(docId).populate({
      path: "sharedWith.user",
      select: "fullName email avatar",
    });

    if (!document) {
      res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Get Document By ID Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
export const deleteDoc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Documents.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete Doc Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
export const shareDoc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    const userToShare = await User.findOne({ email });
    if (!userToShare?._id) {
      res.status(404).json({ message: "User not found" });
    }

    const doc = await Documents.findById(id);

    if (!doc) {
      res.status(404).json({ message: "Document not found" });
    }

    const alreadyShared = doc?.sharedWith.find(
      (share) => share.user.toString() === userToShare?._id.toString()
    );

    if (alreadyShared) {
      alreadyShared.role = role;
    } else {
      doc?.sharedWith.push({
        //disable-eslint
        user: userToShare._id,
        role,
      });
    }

    await doc?.save();
    res.json({ message: "Document shared successfully." });
  } catch (error) {
    console.error("Share Doc Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
export const togglePublic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;

    const doc = await Documents.findByIdAndUpdate(
      id,
      { isPublic },
      { new: true }
    );

    res.json(doc);
  } catch (error) {
    console.error("Toggle Public Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
export const togglePublicAccess = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { publicAccess, publicRole } = req.body;

  const doc = await Documents.findByIdAndUpdate(
    id,
    { publicAccess, publicRole },
    { new: true }
  );

  if (!doc) res.status(404).json({ message: "Document not found" });
  res.status(200).json(doc);
};

export const getPublicDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const document = await Documents.findById(id)
      .populate("owner", "fullName email avatar")
      .populate("sharedWith.user", "fullName email avatar");

    if (!document) {
      res.status(404).json({ message: "Document not found" });
    }

    if (!document?.publicAccess) {
      res
        .status(403)
        .json({ message: "This document is not publicly accessible" });
    }

    res.status(200).json({
      data: {
        _id: document?._id,
        title: document?.title,
        content: document?.content,
        owner: document?.owner,
        publicRole: document?.publicRole,
      },
    });
  } catch (error) {
    console.error("Error fetching public document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
