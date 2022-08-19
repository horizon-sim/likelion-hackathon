import express from "express";
import shop from "./shop";
import pet from "./pet";
import coordinate from "./coordinate";
import reserve from "./reserve";
import time from "./time";



const router = express();

router.use("/shop", shop);
router.use("/pet", pet);
router.use("/coordinate", coordinate);
router.use("/reserve", reserve);
router.use("/time", time);



export default router;