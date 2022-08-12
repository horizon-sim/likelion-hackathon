import express from "express";
import shop from "./shop";
import pet from "./pet";
import coordinate from "./coordinate";
import reserve from "./reserve";

const router = express.Router();

router.use("/shop", shop);
router.use("/pet", pet);
router.use("/coordinate", coordinate);
router.use("/reserve", reserve);

export default router;