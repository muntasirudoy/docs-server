import { Router } from "express";
import {
  createDoc,
  deleteDoc,
  getMyDocs,
  getSharedDocs,
  updateDoc,
  getDocumentByDocumentId,
  shareDoc,
  togglePublic,
  getPublicDocument,
  togglePublicAccess,
} from "../controllers/document.controller";

// import { authMiddleware } from "../middlewares/auth.middleware";
// import { hasPermission } from "../middlewares/permission.middleware";

const router = Router();

router.post("/", createDoc);

router.get("/user/:id", getMyDocs);

router.get("/shared/:id", getSharedDocs);

router.get("/single/:docId", getDocumentByDocumentId);

router.put("/single/:id", updateDoc);

router.delete("/:id", deleteDoc);

// router.post("/share/:id", shareDoc);
router.post("/share/:id", togglePublicAccess);
router.patch("/toggle-public/:id", togglePublic);
router.get("/share/:id", getPublicDocument);
export default router;
