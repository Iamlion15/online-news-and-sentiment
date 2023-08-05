import express from "express";
import adminController from "../../controllers/adminController";
import checkAuth from "../../middlewares/checkAuthentication";
import checkUser from "../../middlewares/checkUser";

const router=express.Router();

router.post("/adduser",checkAuth,checkUser,adminController.addUser);
router.post("/grantacess",checkAuth,adminController.accessRights);
router.post("/updateaccessrights",checkAuth,adminController.updateAccessRights);
router.post("/modifyuser",checkAuth,adminController.updateUser);
router.delete("/deleteuser",checkAuth,adminController.deleteUser);
router.get("/getusers",checkAuth,adminController.getallUsers);
router.get("/getoneuser/:id",checkAuth,adminController.findUser)
router.post("/login",adminController.login);
router.get("/getnews",checkAuth,adminController.getAllNews);
router.get("/getreviews/:id",checkAuth,adminController.getNewsReview);
router.get("/getrights",checkAuth,adminController.getAllAccessRights);


export default router;


