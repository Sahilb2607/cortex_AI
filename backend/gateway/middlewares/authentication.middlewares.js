import redis from "../../shared/redis/redis.js";
const authenticate = async (req, res, next) => {
    try{
     const SessionId=req.cookies.session;
    if(!SessionId){
            return res.status(401).json({message: "Unauthorized"});
        }
        const session = await redis.get(`session:${SessionId}`);
        if (!session) {
            return res.status(401).json({message: "Invalid session"});
        }
        req.user = JSON.parse(session);
        next();
    }
    catch(error){
        return res.status(500).json({message: `Error while authenticating ${error}`});
    }
}
export default authenticate;