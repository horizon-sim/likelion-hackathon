import express from "express";
import auth from "./auth";
import dotenv from "dotenv";
import api from "./api";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use("/auth", auth);
app.use("/api", api);

const { sequelize } = require("../models");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => { 
  console.log(`http://localhost:${port}`);
});

