import adminModel from '../model/adminModel'
import { hashPassword } from "./hash_match_password";
import dbConnect from '../database/db';
dbConnect();
const createAdmin = async (usern, pass) => {
    try {
        const existingUser = await adminModel.findOne({ username: usern });
        if (!existingUser == null) {
            console.log("admin user already exists")
        }
        else {
            const hpass = await hashPassword(pass);
            const adminUser = new adminModel({
                username: usern,
                password: hpass
            })
            await adminUser.save()
            console.log("saved admin sucessfully")
        }
    } catch (error) {
        console.log(error)
    }
}

const username = process.argv[2];
const password = process.argv[3];

createAdmin(username, password);