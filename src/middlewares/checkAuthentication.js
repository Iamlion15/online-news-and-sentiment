import jwt from 'jsonwebtoken'

const checkAuth=async(req,res,next)=>{
    const token=req.header("x-auth-token");
    try {
        const user=await jwt.verify(token,process.env.TOKEN_SECRET);
        req.admin=user.username;
        next();
    } catch (error) {
        res.status(403).json({"message":"authentication expired"});
    }
}

export default checkAuth;