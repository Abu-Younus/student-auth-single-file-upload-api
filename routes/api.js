import express from "express";
import * as StudentsController from "../app/controllers/StudentsController.js";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";
import * as FilesController from "../app/controllers/FilesController.js";
const router = express.Router();

// Students
router.post("/registration", StudentsController.registration)
router.post("/login", StudentsController.login)
router.get("/profile-read", AuthMiddleware, StudentsController.profileRead)
router.post("/profile-update", AuthMiddleware, StudentsController.profileUpdate)
router.get("/logout", AuthMiddleware, StudentsController.logout)
router.get("/verify-email/:email", StudentsController.verifyEmail)
router.get("/verify-otp/:email/:otp", StudentsController.verifyOTP)
router.post("/reset-password/:email/:otp", StudentsController.resetPassword)

//file upload
router.post("/file-upload", FilesController.singleFileUpload)
router.get("/read-file/:fileName", FilesController.fileRead)
router.delete("/file-delete/:fileName", FilesController.fileDelete)

export default router;