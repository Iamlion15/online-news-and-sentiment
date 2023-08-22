import check from "../helpers/userCheckCredentials";
import generateUserToken from "../helpers/userTokenGenerator";
import newsModel from "../model/newsModel";
import reviewModel from "../model/newsReview";
import accessCheckup from "../helpers/accessCheckup";
import userModel from "../model/usersModel";
import privilegeModel from "../model/privilegeModel";
import { hashPassword } from "../helpers/hash_match_password";


class UserController {
    static async login(req, res) {
        try {
            const isValid = await check(req.body.nid, req.body.password);
            if (isValid) {
                if (await accessCheckup(req.body.nid)) {
                    const token = await generateUserToken(req.body.nid);
                    res.status(200).json({ "message": "200", "token": token });
                }
                else {
                    res.status(403).json({ "message": "NO ACCESS GRANTED" })
                }
            }
            else {
                res.status(401).json({ "message": "invalid credentials" });
            }
        } catch (error) {
            res.status(500).json({ error })
        }
    }

static async getDetails(req, res) {

        const visitor = await userModel.findOne({ nID: req.user });
        try {
            res.status(200).json(visitor)
        }
        catch (error) {
            res.status(400).json(error.message);
        }
    }


    static async getallNews(req, res) {
        try {
            const news = await newsModel.find();
            res.status(200).json(news)
        } catch (error) {
            res.status(404).json(error.message);
        }
    }

    static async addReview(req, res) {
        const personel=await userModel.findOne({nID:req.user})
        const review = new reviewModel({
            title:req.body.title,
            comment: req.body.comment,
            date: Date.now(),
            user: personel._id,
            news: req.body.news
        })
        console.log(req.body.news);
        try {
            const data = await review.save();
            res.status(200).json({ "message": "successfully saved review" })
        }
        catch (error) {
            res.status(500).json(error.message);
        }
    }

    static async modifyReview(req, res) {
        const review = await reviewModel.findOne({ _id:req.body._id });
        try {
            const data = await reviewModel.findOneAndUpdate(review._id, req.body);;
            res.status(200).json({ "message": "successfully updated review" })
        }
        catch (error) {
            res.status(500).json(error.message);
            console.log(error);
        }
    }

    static async deleteReview(req, res) {
        const user = await reviewModel.findOne({ _id: req.body.id });
        try {
            const data = await reviewModel.findOneAndDelete(user._id);
            res.status(200).json({ "message": "successfully deleted" })
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    static async getReviews(req, res) {
        const newsid = req.params.id;
        try {
            const reviews = await reviewModel.find({ news: newsid }).populate('news').populate('user');
            res.status(200).json( reviews )
        } catch (error) {
            res.status(404).json(error.message)
        }
    }

    static async getNews(req, res) {
        const newsid = req.params.id;
        try {
            const news = await newsModel.findOne({_id:newsid});
            res.status(200).json(news)
        } catch (error) {
            res.status(404).json(error.message)
        }
    }
static async updateUser(req, res) {
        const user = await userModel.findOne({ nID: req.body.nID });
	console.log(user)
	console.log(req.body)
        try {
            const data = await userModel.findOneAndUpdate(user._id, req.body);
            res.status(200).json({ "message": "successfully updated" })
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    static async register(req, res) {
        const personel = new userModel({ ...req.body, password: await hashPassword(req.body.password) });
        try {
            const data = await personel.save();
            try {
                const privileges = new privilegeModel({
                    privilege:"NO_ACCESS",
                    user:data._id
                });
                const accessright = await privileges.save();
                res.status(200).json({ "message": "successfully registered" })
            } catch (error) {
                res.status(404).json(error.message)
            }
        }
        catch (error) {
	console.log(error);
            if (error.code === 11000) {
                res.status(405).json({ "message": "email has been used" });
            }
            else {
                res.status(400).json(error.message);
                console.log(error);
                console.log(error.code);
            }
        }

    }


}

export default UserController;