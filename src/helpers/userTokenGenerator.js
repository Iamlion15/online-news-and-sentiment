import jwt from 'jsonwebtoken'
import configEnv from "./configEnv";

const generateUserToken=async(nid)=>{
    const token=await jwt.sign(
        {nid},
        process.env.TOKEN_SECRET,{
            expiresIn:'30m'
        }
    )
    return token;
}

export default generateUserToken;