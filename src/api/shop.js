import express from "express";
import { verifyToken } from "../auth/token";
import { User } from '../../models';
import { Shop } from '../../models';

const router = express.Router();

// // 점주 인증
// router.post("/cf", verifyToken, async (req, res) => {
//     const shop_name = req.body.shop_name;
// });

// 지점(상세정보 데이터 넣기)
router.post("/", verifyToken, async (req, res) => {
    const shopName = req.body.shopName;
    const workTime = req.body.workTime;//영업시간
    const shopNum = req.body.shopNum;//shop 전화번호
    const designerNum = req.body.designerNum;//디자이너 몇명인지
    const workName = req.body.workName; // 사업자
    const address = req.body.address;
    // const shop_img = req.body.shop_img;
    const userId = req.decoded.id;

    
    const userIdCheck = await User.findAll({
        where:{
            id : userId
        }
    });

    const newShop = await Shop.create({
        shop_name : req.body.shop_name,
        work_time : req.body.work_time,
        shop_num : req.body.shop_num,
        designer_num : req.body.designer_num,
        work_name : req.body.work_name,
        address : req.body.address,
        userId : userId
    });
    return res.json({
        data : "지점이 등록되었습니다."
    });
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
        attributes: ["shopName", "workTime", "shopNum", "address", "shopImg"]
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