import jwt from 'jsonwebtoken'
import configEnv from "./configEnv";

const generateToken=async(username)=>{
    const token=await jwt.sign(
        {username},
        process.env.TOKEN_SECRET,{
            expiresIn:'20m'
        }
    )
    return token;
}

export default generateToken;