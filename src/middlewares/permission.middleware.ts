// import Documents from "../models/Documents";

// export const hasPermission = (action: "view" | "edit") => {
//   return async (req: Request, res: Response, next: Function) => {
//     const { docId } = req.params;
//     const userId = req.user.id;

//     const doc = await Documents.findById(docId);

//     if (!doc) {
//       return res.status(404).json({ message: "Document not found" });
//     }

//     if (
//       doc.owner.toString() === userId ||
//       doc.isPublic ||
//       doc.sharedWith.find(
//         (s) =>
//           s.user.toString() === userId &&
//           (action === "view" || s.role === "editor")
//       )
//     ) {
//       return next();
//     }

//     return res.status(403).json({ message: "Access denied" });
//   };
// };
