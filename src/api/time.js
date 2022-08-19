// import { Reserve } from "../../models";
// import express from "express";
// import { verifyToken } from "../auth/token";
// import dateData from "./dateData";
// import { Shop } from '../../models';
// import { Order } from '../../models';

// const router = express.Router();

// router.get("/:shopId", verifyToken, async (req, res) => {
//     const { shopId } = req.params;
//     const { month,day } = req.body;

//     const shopIdCheck = await Shop.findAll({
//         where:{
//             id : shopId
//         }
//     });
//     if(shopIdCheck.length != 0) {
//         console.log(dateData);
//         const workTime = await Order.findAll({attributes: ['orderDate'], raw: 'true'});
//         const returnData = [];
//         workTime.map((noDate, index) => {
//             console.log(noDate.noDate);
//             const month1 = getMonth(add(noDate.noDate, {hours: -9, months: 1}));
//             const day1 = getDate(add(noDate.noDate, {hours: -9}));
//             console.log(month1,month, day1, day);
//             if(month1 == month && day1 == day){
//                 console.log(month1)
//                 console.log(month)
//                 returnData.push(getHours(add(noDate.noDate, {hours: -9})))
//             };
//         });
//         return res.json({
//             data : dateData.filter((dateData) => dateData != returnData)
//         });
//     }


// });

// export default router;

import { add, getDate, getDay, getHours, getMonth } from "date-fns";
import { Router } from "express";
import { Order } from "../../models";
import { verifyToken } from "../auth/token";
import dateData from "./dateData";
const router = Router();
router.get("/:shopId/:petId", verifyToken, async (req, res) => {
    const userId = req.decoded.id;
    const { shopId } = req.params;
    const { petId } = req.params;
    const month = req.body.month;
    const day = req.body.day;
    const orderCheck = await Order.findAll({
        attributes: ["orderDate"],
        where:{
            shopId : shopId
        },
        raw : "true"
    });
    let returnData = [];
    if (orderCheck.length != 0) {
        for (let i = 0; i < orderCheck.length; i++) {
            let addDate = add(orderCheck[i].orderDate, {
                months: 1
            })
            let addPushDate = add(orderCheck[i].orderDate, {
                hours: 9
            })
            let serverMonth = getMonth(addDate);
            let serverDay = getDate(addDate);
            let serverHours = getHours(orderCheck[i].orderDate);
            console.log("디비 데이터 : ", orderCheck[i].orderDate);
            console.log("수정 데이터1 : ",addDate);
            console.log("수정 데이터2 : ",addPushDate);
            

            console.log("서버 달 : ",serverMonth);
            console.log("서버 일 : ",serverDay);
            console.log("서버 시간 : ",serverHours);
            console.log("---------------");
            if (month == serverMonth && day == serverDay) {
                returnData.push(serverHours);
            }
        }
        let difference = dateData.filter(x => !returnData.includes(x));
        return res.json({
            data : difference
        });
    }
    return res.json({
        data : "예약 내역이 없습니다."
    });
});
export default router;