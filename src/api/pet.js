import express from "express";
import { verifyToken } from "../auth/token";
import { User } from '../../models';
import { Pet } from '../../models';
import { Order } from '../../models';
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

aws.config.update({
    "accessKeyId": process.env.S3KEY,
    "secretAccessKey": process.env.S3SECRETKEY,
    "region": "ap-northeast-2"
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket : 'dangmes3',
        acl: 'public-read-write',
        key: function(req, file, cb){
            cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 이름 설정
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// 반려견 정보 등록
router.post("/", verifyToken, upload.single("petimg"), async (req, res) => {
    
    const petName = req.body.petName;
    const weight = req.body.weight;
    const age = req.body.age;
    const dogBreed = req.body.dogBreed;
    const note = req.body.note;
    const userId = req.decoded.id;

    const petImg = req.file == undefined ? "": req.file.location;

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
            petImg: petImg,
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

//반려견 정보 수정 (보류 - 마이페이지)
router.put("/:petId", verifyToken, async (req, res) => {
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
                    id : parseInt(petId)
                }
            });
            return res.json({
                data : "강아지 정보가 수정되었습니다."
            });
        };
    }
    catch(error) {
        return res.status(409).json({
            error : "수정오류"
        });
    }
    
});

// 반려견 정보 삭제 (보류 - 마이페이지)
router.delete("/:petId", verifyToken, async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.decoded.id;

        const petIdCheck = await Pet.findAll({
            where:{
                userId : userId
            }
        });

        if(petIdCheck.length != 0) {
            const newPet = await Pet.destroy({
                where : {
                    id : parseInt(petId)
                }
            });
            return res.json({
                data : "강아지 정보가 삭제되었습니다."
            });
        };
    }
    catch(error) {
        return res.status(409).json({
            error : "삭제오류"
        });
    }
});


// 반려견 메인화면 예약내역 노출
router.get("/main", verifyToken, async (req, res) => {
    
    const userId = req.decoded.id;

    const userIdCheck = await User.findAll({
        where:{
            id : userId
        }
    });

    if(userIdCheck.length != 0) {
        const petData = await Pet.findAll({
            attributes: ["petName", "petImg", "id"],
            where:{
                userId : userId
            }
        });

        const orderData = await Order.findAll({
            attributes: ["shopName", "orderDate"],
            where:{
                userId : userId
            }
        });
        let data = [];
        for (let i = 0; i < petData.length; i++ ) {
            let pushData = { 
                id : null,
                petName : null,
                petImg : null,
                shopName : null,
                orderDate : null
            };

            if(orderData[i] != undefined) {
                pushData.id = petData[i].id;
                pushData.petName = petData[i].petName;
                pushData.petImg = petData[i].petImg;
                pushData.shopName = orderData[i].shopName;
                pushData.orderDate = orderData[i].orderDate;
                data.push(pushData);
            }
            else if(orderData[i] == undefined) {
                pushData.id = petData[i].id;
                pushData.petName = petData[i].petName;
                pushData.petImg = petData[i].petImg;
                data.push(pushData);
            }
        };
        return res.json({
            data : data
        });
    };
    

    return res.status(400).json({
        error : "GET 요청 오류"
    });
});
export default router;