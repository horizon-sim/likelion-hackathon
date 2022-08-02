import express from "express";
import shop from "./shop";
import pet from "./pet";

const router = express.Router();

router.use("/shop", shop);
router.use("/pet", pet);

export default router;