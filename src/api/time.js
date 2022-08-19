import { add, getDate, getDay, getHours, getMonth } from "date-fns";
import { Router } from "express";
import { Reserve } from "../../models";
import { verifyToken } from "../auth/token";
import dateData from "./dateData";
import { Shop } from '../../models';

const router = Router();

router.get("/:shopId", verifyToken, async (req, res) => {
    const { shopId } = req.params;
    const { month,day } = req.body;

    const shopIdCheck = await Shop.findAll({
        where:{
            id : shopId
        }
    });
    if(shopIdCheck.length != 0) {
        console.log(dateData);
        const workTime = await Reserve.findAll({
            attributes: ['noDate'],
             raw: 'true'
            });
        const returnData = [];
        workTime.map((noDate, index) => {
            console.log(noDate.noDate);
            const month1 = getMonth(add(noDate.noDate, {hours: 9, months: 1}));
            const day1 = getDate(add(noDate.noDate, {hours: 9}));
            console.log(month1,month, day1, day);
            if(month1 == month && day1 == day){
                returnData.push(getHours(add(noDate.noDate, {
                    hours: 9
                })))
            };
        });
        return res.json({
            data : dateData.filter((dateData) => dateData != returnData)
        });
    }

   
});

export default router;

