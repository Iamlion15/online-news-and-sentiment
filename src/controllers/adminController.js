import userModel from "../model/usersModel";
import check from "../helpers/adminCheckCredentials";
import generateToken from "../helpers/adminTokenGenerator";
import newsModel from "../model/newsModel";
import reviewModel from "../model/newsReview";
import { hashPassword } from "../helpers/hash_match_password";
import privilegeModel from "../model/privilegeModel";


class adminController {
    static async login(req, res) {
        try {
            const isValid = await check(req.body.username, req.body.password);
            if (isValid) {
                const token = await generateToken(req.body.username);
                res.status(200).json({ "message": "successfully logged in", "token": token });
            }
            else {
                res.status(200).json({ "message": "invalid credentials" });
            }
        } catch (error) {
            res.status(500).json({ error })
        }
    }
    static async addUser(req, res) {
        const user = new userModel({ ...req.body, password: await hashPassword(req.body.password) });
        try {
            const data = await user.save();
            res.status(200).json({ "message": "successfully saved" })
        }

        catch (error) {
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
    static async findUser(req, res) {
        const nid = req.params.id
        const user = await userModel.findOne({ _id: nid })
        if (user == null) {
            res.status(200).json({ "code": "no", "message": "user not found" })
        }
        else {
            res.status(200).json({ "code": "yes", "message": user })
        }
    }

    static async updateUser(req, res) {
        const user = await userModel.findOne({ nID: req.body.nID });
        try {
            const data = await userModel.findOneAndUpdate(user._id, req.body);
            res.status(200).json({ "message": "successfully updated" })
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
    static async deleteUser(req, res) {
        const user = await userModel.findOne({ nID: req.body.nID });
        try {
            const data = await userModel.findOneAndDelete(user._id, req.body);
            res.status(200).json({ "message": "successfully deleted" })
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
    static async getallUsers(req, res) {
        try {
            const data = await userModel.find();
            res.status(200).json(data)
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    static async getAllNews(req, res) {
        try {
            const news = await newsModel.find();
            res.status(200).json(news)
        } catch (error) {
            res.status(404).json(error.message);
        }
    }

    static async getNewsReview(req, res) {
        const newsid = req.params.id;
        try {
            const reviews = await reviewModel.find({ news: newsid }).populate('news').populate('user');
            res.status(200).json( reviews )
        } catch (error) {
            res.status(404).json(error.message)
        }
    }

    static async accessRights(req, res) {
        try {
            const privileges = new privilegeModel(req.body);
            const data = await privileges.save();
            res.status(200).json({ "message": "successfully granted" })
        } catch (error) {
            res.status(404).json(error.message)
        }
    }
    static async updateAccessRights(req, res) {
        const right = await privilegeModel.findOne({ _id: req.body._id });
        let privileg;
        if (right.privilege == "GRANTED") {
            privileg = "NO_ACCESS"
        }
        else {
            if (right.privilege == "NO_ACCESS") {
                privileg = "GRANTED"
            }
        }

        try {
            const data = await privilegeModel.findOneAndUpdate(right._id, { ...req.body, privilege: privileg });
            res.status(200).json({ "message": "successfully updated" })
        } catch (error) {
            res.status(404).json(error.message);
        }
    }

    static async getAllAccessRights(req, res) {
        try {
            const privileges = await privilegeModel.find().populate("user");
            res.status(200).json(privileges)
        } catch (error) {
            res.status(404).json(error.message)
            console.log(error);
        }
    }


}

export default adminController;