import express from "express";
import { User } from '../../models';
import { Pet } from '../../models';
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import emailsame from "./emailsame";
import fs from "fs";
import path from "path";
import multer from "multer";

const router = express.Router();

router.use("/emailsame", emailsame);

// 반려견 사진 추가
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) { // 저장 위치
            done(null, 'img/'); // uploads라는 폴더 안에 저장
        },
        filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname); // 파일의 확장자
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// 회원가입
router.post("/register", upload.single("petimg"), async (req, res) => {
    
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
    const petImg = req.file == undefined ? "": req.file.path;

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
            isOwner : isOwner,
            coordinateX : 10.123,
            coordinateY : 123.121
        });
        const newPet = await Pet.create({
            petName : petName,
            age : age,
            weight : weight,
            dogBreed : dogBreed,
            note : note,
            petImg : petImg,
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


export default router;