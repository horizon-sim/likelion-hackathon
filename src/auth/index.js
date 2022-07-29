import express from "express";
import { User } from '../../models';
import { Pet } from '../../models';
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { verifyToken } from "./token";
import emailsame from "./emailsame";

const router = express.Router();

router.use("/emailsame", emailsame);

// 회원가입
router.post("/register", async (req, res) => {
    
    // 유저
    const user_name = req.body.user_name;
    const password = req.body.password;
    const phone_num = req.body.phone_num;
    const email = req.body.email;

    let isowner = false;

    // 펫
    const pet_name = req.body.pet_name;
    const weight = req.body.weight;
    const age = req.body.age;
    const dog_breed = req.body.dog_breed;
    const note = req.body.note;


    const dbcheck = await User.findAll({
        where:{
            email : email
        }
    });

    const dbIdcheck = await User.findAll({});

    if(dbcheck.length == 0) {
        let bypassword = await bcrypt.hash(password, 1);
        const newUser = await User.create({
            user_name : user_name,
            password : bypassword,
            phone_num : phone_num,
            email : email,
            isowner : isowner
        });
        const newPet = await Pet.create({
            pet_name : pet_name,
            age : age,
            weight : weight,
            dog_breed : dog_breed,
            note : note,
            user_id : dbIdcheck.length + 1
        });
        
        return res.json({
            data : "회원가입 되었습니다."
        })
    };
    
    return res.status(409).json({
        error : "이미 존재하는 아이디 입니다."
    });

});

// 로그인
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
            return res.status(401).json({
                error : "아이디 또는 비밀번호가 틀렸습니다."
            });
        };  
    };
    
    return res.status(409).json({
        error : "아이디가 존재하지 않습니다."
    });
});

// 반려견 정보 입력
router.post("/dogdata", verifyToken, async (req, res) => {
    const pet_name = req.body.pet_name;
    const weight = req.body.weight;
    const age = req.body.age;
    const dog_breed = req.body.dog_breed;
    const note = req.body.note;
    const user_id = req.decoded.id;
    
    const userIdCheck = await User.findAll({
        where:{
            id : user_id
        }
    });

    if(userIdCheck.length != 0) {
        const newPet = await Pet.create({
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

//------------------강아지 정보 수정----------------------
router.put("/dogdata/:petId", verifyToken, async (req, res) => {
    try {
    const { petId } = req.params;
    const pet_name = req.body.pet_name;
    const weight = req.body.weight;
    const age = req.body.age;
    const dog_breed = req.body.dog_breed;
    const note = req.body.note;
    const user_id = req.decoded.id;

    const petIdCheck = await Pet.findAll({
        where:{
            user_id : user_id
        }
    });

    if(petIdCheck.length != 0) {
        const newPet = await Pet.update({
            pet_name : pet_name,
            age : age,
            weight : weight,
            dog_breed : dog_breed,
            note : note
        }, {
            where : {
                id : petIdCheck[parseInt(petId)-1].id
            }
        });
        return res.json({
            data : "강아지 정보가 수정되었습니다."
        });
    };
    }
    catch(error) {
        return res.status(409).json({
            erroe : "수정오류"
        });
    }
    
});

export default router;