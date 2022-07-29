import express from "express";
import { User } from '../../models';

const router = express.Router();


router.post("/", async (req, res) => {
    const email = req.body.email;
    
    const idCheck = await User.findAll({
        attributes:["email"],
        where:{
            email : email
        }
    });

    if (idCheck.length == 0) {
        return res.json({
            data : "아이디 사용가능"
        });
    }
    return res.status(409).json({
        error : "아이디가 이미 존재합니다."
    });
});

export default router;