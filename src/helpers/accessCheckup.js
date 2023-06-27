import userModel from "../model/usersModel";
import privilegeModel from "../model/privilegeModel";

const accessCheckup = async (nid) => {
    const useraccess = await userModel.findOne({ nID: nid });
    const accessright = await privilegeModel.findOne({ user: useraccess._id });
    if (!(accessright == null)) {
        if (accessright.privilege == "GRANTED") {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }

}


export default accessCheckup



