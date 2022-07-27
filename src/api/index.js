import express from "express";
import shop from "./shop";

const router = express.Router();

router.use("/shop", shop);

export default router;