const dotenv = require("dotenv");
dotenv.config();

const s3List  = {
    "accessKeyId": process.env.S3KEY,
    "secretAccessKey": process.env.S3SECRETKEY,
    "region": "ap-northeast-2"
}
module.exports = s3List;