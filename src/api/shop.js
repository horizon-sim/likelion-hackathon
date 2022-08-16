import express from "express";
import { verifyToken } from "../auth/token";
import { User } from '../../models';
import { Shop } from '../../models';
import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import dotenv from "dotenv";

const router = express.Router();

// // 점주 인증
// router.post("/cf", verifyToken, async (req, res) => {
//     const shop_name = req.body.shop_name;
// });

// 지점 사진 추가
// 반려견 사진 추가
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

// 지점 정보 저장
router.post("/", verifyToken, upload.single("shopimg"), async (req, res) => {
    const shopName = req.body.shopName;//가게 이름
    const intro = req.body.intro;//소개
    const workTime = req.body.workTime;//영업시간
    const workHoly = req.body.workHoly;//휴무일
    const shopNum = req.body.shopNum;//shop 전화번호
    const workName = req.body.workName; // 사업자
    const address = req.body.address;//주소
    const parking = req.body.parking;//주차
    const shopImg = req.file == undefined ? "": req.file.location;
    const userId = req.decoded.id;

    
    const userIdCheck = await User.findAll({
        where:{
            id : userId
        }
    });

    const newShop = await Shop.create({
        shopName : shopName,
        intro : intro,
        workTime : workTime,
        workHoly : workHoly,
        shopNum : shopNum,
        workName : workName,
        address : address,
        parking : parking,
        shopImg : shopImg,
        userId : userId,
        coordinateX : 37.2227,
        coordinateY : 127.1902
    });
    return res.json({
        data : "지점이 등록되었습니다."
    });
});

//지점 정보 수정 (보류 - 마이페이지)
router.put("/:shopId", verifyToken, async (req, res) => {
    try {
        const { shopId } = req.params;
        const intro = req.body.intro;
        const shopName = req.body.shopName;
        const workTime = req.body.workTime;
        const shopNum = req.body.shopNum;
        const workName = req.body.workName;
        const address = req.body.address;
        const parking = req.body.parking;
        const shopImg = req.body.shopImg;
        const userId = req.decoded.id;


        const shopIdCheck = await Shop.findAll({
            where:{
                userId : userId
            }
        });

        if(shopIdCheck.length != 0) {
            const newShop = await Shop.update({
                shopName : shopName,
                intro : intro,
                workTime : workTime,
                shopNum : shopNum,
                workName : workName,
                parking : parking,
                address : address
            }, {
                where : {
                    id : parseInt(shopId)
                }
            });
            return res.json({
                data : "가게 정보가 수정되었습니다."
            });
        };
    }
    catch(error) {
        return res.status(409).json({
            error : "수정오류"
        });
    }
    
});

// 지점 정보 삭제 (보류 - 마이페이지)
router.delete("/:shopId", verifyToken, async (req, res) => {
    try {
        const { shopId } = req.params;
        const userId = req.decoded.id;

        const shopIdCheck = await Shop.findAll({
            where:{
                userId : userId
            }
        });

        if(shopIdCheck.length != 0) {
            const newShop = await Shop.destroy({
                where : {
                    id : parseInt(shopId)
                }
            });
            return res.json({
                data : "가게 정보가 삭제되었습니다."
            });
        };
    }
    catch(error) {
        return res.status(409).json({
            error : "삭제오류"
        });
    }
});

// 특정 지점 확인
// router.get("/:postId", async (req, res) => {
//     const shop_name = req.body.shop_name;
//     const work_time = req.body.work_time;//영업시간
//     const shop_num = req.body.shop_num;//shop 전화번호
//     const designer_num = req.body.designer_num;//디자이너 몇명인지
//     const work_name = req.body.work_name; // 사업자
//     const address = req.body.address;
//     // const shop_img = req.body.shop_img;
//     const user_id = req.decoded.id;

    
//     const userIdCheck = await User.findAll({
//         where:{
//             id : user_id
//         }
//     });

//     if (req.decoded.name == name) {
//         if (dbcheck.length > 0) {
//             return res.json({
//                 info : dbcheck[0],
//                 data : "이미 존재합니다."
//             })
//         }
//         General.create({
//             name: name,
//             content: content,
//             time: time
//         });

//         return res.json({
//             data : "추가되었습니다."
//         });
//     }
//     return res.json({
//         data : "로그인 후 이용가능한 서비스 입니다."
//     })
// });

// 전체 지점 확인
router.get("/", async (req, res) => {

    const shopList = await Shop.findAll({
        attributes: ["shopName", "intro", "workTime", "workHoly", "shopNum", "address", "parking", "shopImg"]
    });

    if (shopList.length == 0) {
        return res.json({
            data : "지점이 존재하지 않습니다."
        });
    };
    return res.json({
        data : shopList
    })
});

export default router;