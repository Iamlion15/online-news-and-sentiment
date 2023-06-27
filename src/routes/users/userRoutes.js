import express from "express";
import UserController from "../../controllers/userController";
import checkAuth from "../../middlewares/checkUserAuthentication";

const router=express.Router();

router.post("/addreview",checkAuth,UserController.addReview);
router.post("/modifyreview",checkAuth,UserController.modifyReview);
router.delete("/deletereview",checkAuth,UserController.deleteReview);
router.get("/getreviews",checkAuth,UserController.getReviews);
router.get("/getnewsreview",checkAuth,UserController.getNewsReview);
router.post("/login",UserController.login);

export default router;


