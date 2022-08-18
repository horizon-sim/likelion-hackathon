import express from "express";
import { verifyToken } from "../auth/token";
import { User } from '../../models';
import { Shop } from '../../models';

const router = express.Router();

// 좌표 계산
function getDistance(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

// 거리에 따른 지점 좌표 보내주기 좌표 계산 (get)
// 메인화면, 검색 노출
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.decoded.id;

        const userCoorCheck = await User.findAll({
            attributes: ["coordinateX", "coordinateY"],
            where:{
                id : userId
            }
        });

        const shopCoorCheck = await Shop.findAll({});
        
        let userPosX = userCoorCheck[0].coordinateX;
        let userPosY = userCoorCheck[0].coordinateY;
        let shopdisList = [];

        if(userCoorCheck.length != 0) {
            for(let i = 0; i < shopCoorCheck.length; i++) {
                let shopPosX = shopCoorCheck[i].coordinateX;
                let shopPosY = shopCoorCheck[i].coordinateY;
                console.log(getDistance(userPosX, userPosY, shopPosX, shopPosY));
                let distance = getDistance(userPosX, userPosY, shopPosX, shopPosY)
                if (distance < 5) {
                    shopdisList.push(shopCoorCheck[i])
                }
            }

            return res.json({
                data : shopdisList
            })
        };

    }
    catch(error) {
        return res.status(400).json({
            error : "GET요청 오류"
        });
    }
    
});

// 지점 좌표 저장
router.put("/shop/:shopId", verifyToken, async (req, res) => {
    try {
        const { shopId } = req.params;
        const coordinateX = req.body.coordinateX;
        const coordinateY = req.body.coordinateY;
        const userId = req.decoded.id;

        const shopIdCheck = await Shop.findAll({
            where:{
                id : shopId
            }
        });
        

        if(shopIdCheck.length != 0) {
            const putUserCoordinate = await Shop.update({
                coordinateX : coordinateX,
                coordinateY : coordinateY
            }, {
                where : {
                    id : parseInt(shopId)
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