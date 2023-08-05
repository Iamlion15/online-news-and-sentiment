import express from "express";
import UserController from "../../controllers/userController";
import checkAuth from "../../middlewares/checkUserAuthentication";

const router=express.Router();

router.post("/addreview",checkAuth,UserController.addReview);
router.post("/modifyreview",checkAuth,UserController.modifyReview);
router.delete("/deletereview",checkAuth,UserController.deleteReview);
router.get("/getreviews/:id",checkAuth,UserController.getReviews);
router.get("/getnews/:id",checkAuth,UserController.getNews);
router.get("/getnews",UserController.getallNews);
router.post("/login",UserController.login);
router.post("/register",UserController.register)

export default router;


