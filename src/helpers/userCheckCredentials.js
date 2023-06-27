import userModel from "../model/usersModel";
import { matchPassword } from "./hash_match_password";

const check = async (nid, password) => {

    try {
        const user = await userModel.findOne({ nID: nid });
        if (user == null) {
            return null;
        }
        else {
            const isPasswordMatching = await matchPassword(password, user.password);
            if (isPasswordMatching) {
                return true;
            }
            else {
                console.log(user);
                return false;
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default check;