import userModel from "../model/usersModel"

const checkUser=async(req,res,next)=>{
    const user=await userModel.findOne({nID:req.body.nID})
    if(user==null)
    {
        next()
    }
    else
    {
        res.status(204).json({"code":100})
    }
}

export default checkUser;