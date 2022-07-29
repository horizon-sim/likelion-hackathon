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
    const userName = req.body.userName;
    const password = req.body.password;
    const phoneNum = req.body.phoneNum;
    const email = req.body.email;

    let isOwner = false;

    // 펫
    const petName = req.body.petName;
    const weight = req.body.weight;
    const age = req.body.age;
    const dogBreed = req.body.dogBreed;
    const note = req.body.note;


    const dbCheck = await User.findAll({
        where:{
            email : email
        }
    });

    const dbIdCheck = await User.findAll({});

    if(dbCheck.length == 0) {
        let bypassword = await bcrypt.hash(password, 1);
        const newUser = await User.create({
            userName : userName,
            password : bypassword,
            phoneNum : phoneNum,
            email : email,
            isOwner : isOwner
        });
        const newPet = await Pet.create({
            petName : petName,
            age : age,
            weight : weight,
            dogBreed : dogBreed,
            note : note,
            userId : dbIdCheck.length + 1
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

    const dbCheck = await User.findAll({
        where:{
            email : email
        }
    });

    if(dbCheck.length == 1) {
        const same = bcrypt.compareSync(password, dbCheck[0].password);
        if (same) {
            const token = sign({
                id: dbCheck[0].id,
                userName: dbCheck[0].userName
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
    const petName = req.body.petName;
    const weight = req.body.weight;
    const age = req.body.age;
    const dogBreed = req.body.dogBreed;
    const note = req.body.note;
    const userId = req.decoded.id;
    
    const userIdCheck = await User.findAll({
        where:{
            id : userId
        }
    });

    if(userIdCheck.length != 0) {
        const newPet = await Pet.create({
            petName : petName,
            age : age,
            weight : weight,
            dogBreed : dogBreed,
            note : note,
            userId : userId
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
    const petName = req.body.petName;
    const weight = req.body.weight;
    const age = req.body.age;
    const dogBreed = req.body.dogBreed;
    const note = req.body.note;
    const userId = req.decoded.id;

    const petIdCheck = await Pet.findAll({
        where:{
            userId : userId
        }
    });

    if(petIdCheck.length != 0) {
        const newPet = await Pet.update({
            petName : petName,
            age : age,
            weight : weight,
            dogBreed : dogBreed,
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