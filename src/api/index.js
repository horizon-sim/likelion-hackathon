import express from "express";
import shop from "./shop";
import pet from "./pet";
import coordinate from "./coordinate";

const router = express.Router();

router.use("/shop", shop);
router.use("/pet", pet);
router.use("/coordinate", coordinate);

export default router;