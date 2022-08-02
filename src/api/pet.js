import express from "express";
import { verifyToken } from "../auth/token";
import { User } from '../../models';
import { Pet } from '../../models';

const router = express.Router();

// 반려견 정보 등록
router.post("/", verifyToken, async (req, res) => {
    const petName = req.body.petName;
    const weight = req.body.weight;
    const age = req.body.age;
    const dogBreed = req.body.dogBreed;
    const note = req.body.note;
    const userId = req.decoded.id;

    const userIdCheck = await User.findAll({
        where:{
            id : userId
        }
    });

    if(userIdCheck.length != 0) {
        const newPet = await Pet.create({
            petName : petName,
            age : age,
            weight : weight,
            dogBreed : dogBreed,
            note : note,
            userId : userId
        });
        return res.json({
            data : "강아지 정보가 등록되었습니다."
        });
    };

    return res.json({
        error : "등록오류"
    });
});

//반려견 정보 수정
router.put("/:petId", verifyToken, async (req, res) => {
    try {
        const { petId } = req.params;
        const petName = req.body.petName;
        const weight = req.body.weight;
        const age = req.body.age;
        const dogBreed = req.body.dogBreed;
        const note = req.body.note;
        const userId = req.decoded.id;

        const petIdCheck = await Pet.findAll({
            where:{
                userId : userId
            }
        });

        if(petIdCheck.length != 0) {
            const newPet = await Pet.update({
                petName : petName,
                age : age,
                weight : weight,
                dogBreed : dogBreed,
                note : note
            }, {
                where : {
                    id : petIdCheck[parseInt(petId)-1].id
                }
            });
            return res.json({
                data : "강아지 정보가 수정되었습니다."
            });
        };
    }
    catch(error) {
        return res.status(409).json({
            error : "수정오류"
        });
    }
    
});

// 반려견 정보 삭제
router.delete("/:petId", verifyToken, async (req, res) => {
    try {
        const { petId } = req.params;
        const petName = req.body.petName;
        const weight = req.body.weight;
        const age = req.body.age;
        const dogBreed = req.body.dogBreed;
        const note = req.body.note;
        const userId = req.decoded.id;

        const petIdCheck = await Pet.findAll({
            where:{
                userId : userId
            }
        });

        if(petIdCheck.length != 0) {
            const newPet = await Pet.destroy({
                where : {
                    id : petIdCheck[parseInt(petId)-1].id
                }
            });
            return res.json({
                data : "강아지 정보가 삭제되었습니다."
            });
        };
    }
    catch(error) {
        return res.status(409).json({
            error : "삭제오류"
        });
    }
});

export default router;