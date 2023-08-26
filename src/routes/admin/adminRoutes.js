import express from "express";
import adminController from "../../controllers/adminController";
import checkAuth from "../../middlewares/checkAuthentication";
import checkUser from "../../middlewares/checkUser";
import statisticsController from "../../controllers/statisticsController";

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
router.get("/statistics",checkAuth,statisticsController.newspaperStatistics);
router.get("/newspaperstats",checkAuth,statisticsController.IndividualNewspaperContribution);
router.get("/percentagestats",checkAuth,statisticsController.newspaperPercentage);
router.post("/reviewsrange",checkAuth,statisticsController.getReviewsInDateRange);
router.get("/newsreviewstatus",checkAuth,statisticsController.getReviewedNewsArticlesCount);
router.get("/newsreviewsentimentstatus",checkAuth,statisticsController.getSentimentReviewCounts);
router.get("/userstatistics",checkAuth,statisticsController.getUserCountsByPrivilege);
router.get("/reviewerstats",checkAuth,statisticsController.getUsersWithReviewStatus);








export default router;


