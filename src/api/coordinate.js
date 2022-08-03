import express from "express";
import { verifyToken } from "../auth/token";
import { User } from '../../models';
import { Shop } from '../../models';

const router = express.Router();

// 거리에 따른 지점 좌표 보내주기 좌표 계산 (get)
// router.get("/shopdis", verifyToken, async (req, res) => {
//     // try {
//         const userId = req.decoded.id;

//         const userIdCheck = await User.findAll({
//             attributes: ["coordinateX", "coordinateY"],
//             where:{
//                 id : userId
//             }
//         });

//         const shopIdCheck = await Shop.findAll({
//             attributes: ["coordinateX", "coordinateY"]
//         });
        

//         if(userIdCheck.length != 0) {
//             for(let i = 0; i < userIdCheck.length; i++) {
//                 userIdCheck[i].id
//             }


//             return res.json({
//                 data : userIdCheck
//             })
//         };

//     // }
//     // catch(error) {
//     //     return res.status(409).json({
//     //         error : "좌표저장 오류"
//     //     });
//     // }
    
// });

// 지점 좌표 저장
router.put("/shop", verifyToken, async (req, res) => {
    try {
        const coordinateX = req.body.coordinateX;
        const coordinateY = req.body.coordinateY;
        const userId = req.decoded.id;

        const shopIdCheck = await Shop.findAll({
            where:{
                userId : userId
            }
        });
        
        if(shopIdCheck.length != 0) {
            const putUserCoordinate = await Shop.update({
                coordinateX : coordinateX,
                coordinateY : coordinateY
            }, {
                where : {
                    userId : userId
                }
            });
            return res.json({
                data : "지점 좌표가 저장되었습니다."
            });
        };
    }
    catch(error) {
        return res.status(409).json({
            error : "지점 좌표저장 오류"
        });
    }
    
});
// 사용자 좌표 저장 (put)
router.put("/user", verifyToken, async (req, res) => {
    try {
        const coordinateX = req.body.coordinateX;
        const coordinateY = req.body.coordinateY;
        const userId = req.decoded.id;

        const userIdCheck = await User.findAll({
            where:{
                id : userId
            }
        });

        if(userIdCheck.length != 0) {
            const putUserCoordinate = await User.update({
                coordinateX : coordinateX,
                coordinateY : coordinateY
            }, {
                where : {
                    id : userId
                }
            });
            return res.json({
                data : "사용자 좌표가 저장되었습니다."
            });
        };
    }
    catch(error) {
        return res.status(409).json({
            error : "사용자 좌표저장 오류"
        });
    }
    
});

export default router;