import express from "express";
import { User } from '../../models';
import { Pet } from '../../models';
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { verifyToken } from "./token";

const router = express.Router();

router.post("/register", async (req, res) => {
    const user_name = req.body.user_name;
    const password = req.body.password;
    const phone_num = req.body.phone_num;
    const email = req.body.email;

    const dbcheck = await User.findAll({
        where:{
            email : email
        }
    });

    if(dbcheck.length == 0) {
        let bypassword = await bcrypt.hash(password, 1);
        const newUser = await User.create({
            user_name : user_name,
            password : bypassword,
            phone_num : phone_num,
            email : email
        });
        return res.json({
            data : "회원가입 되었습니다."
        })
    }
    
    return res.json({
        data : "이미 존재하는 아이디 입니다."
    })
});

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const dbcheck = await User.findAll({
        where:{
            email : email
        }
    });

    if(dbcheck.length == 1) {
        const same = bcrypt.compareSync(password, dbcheck[0].password);
        if (same) {
            const token = sign({
                id: dbcheck[0].id,
                user_name: dbcheck[0].user_name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
                issuer: "developer"
            }
        );
            return res.json({
                data : "로그인 되었습니다.(토큰 1시간 지속)",
                token
            });
        }
        else if (same == false) {
            return res.json({
                data : "아이디 또는 비밀번호가 틀렸습니다."
            });
        };  
    };
    
    return res.json({
        data : "아이디가 존재하지 않습니다."
    });
});

router.post("/dogdata", verifyToken, async (req, res) => {
    const pet_name = req.body.pet_name;
    const weight = req.body.weight;
    const age = req.body.age;
    const dog_breed = req.body.dog_breed;
    const note = req.body.note;
    const user_id = req.decoded.id
    
    const userIdCheck = await User.findAll({
        where:{
            id : user_id
        }
    });

    if(userIdCheck.length != 0) {
        const newUser = await Pet.create({
            pet_name : pet_name,
            age : age,
            weight : weight,
            dog_breed : dog_breed,
            note : note,
            user_id : user_id
        });
        return res.json({
            data : "강아지 정보가 등록되었습니다."
        });
    };

    return res.json({
        error : "등록오류"
    });
});

export default router;