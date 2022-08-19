import { add, getDate, getDay, getHours, getMonth } from "date-fns";
import { Router } from "express";
import { Reserve } from "../../models";
import { verifyToken } from "../auth/token";
import dateData from "./dateData";

const router = Router();

router.get("/", verifyToken, async (req, res) => {
    const { month,day } = req.body;
    console.log(dateData);
    const workTime = await Reserve.findAll({attributes: ['noDate'], raw: 'true'});
    const returnData = [];
    workTime.map((noDate, index) => {
        console.log(noDate.noDate);
        const month1 = getMonth(add(noDate.noDate, {hours: -9, months: 1}));
        const day1 = getDate(add(noDate.noDate, {hours: -9}));
        console.log(month1,month, day1, day);
        if(month1 == month && day1 == day){
            returnData.push(getHours(add(noDate.noDate, {hours: -9})))
        };
    });
    console.log(returnData);
    return res.json({
        data : dateData.filter((dateData) => dateData != returnData)
    });
   
});

export default router;