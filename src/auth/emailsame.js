import express from "express";
import { User } from '../../models';

const router = express.Router();

router.post("/", async (req, res) => {
    const email = req.body.email;
    
    const idcheck = await User.findAll({
        where:{
            email : email
        }
    });

    if (idcheck.length == 0) {
        return res.json({
            data : "아이디 사용가능"
        });
    }
    return res.json({
        data : "아이디가 이미 존재합니다."
    });
    
});

export default router;