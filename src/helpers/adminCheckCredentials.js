import adminModel from "../model/adminModel";
import { matchPassword } from "./hash_match_password";

const check = async (usern, password) => {

    try {
        const user = await adminModel.findOne({ username: usern });
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