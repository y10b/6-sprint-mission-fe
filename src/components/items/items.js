import express from 'express'
import mongoose from 'mongoose'
import { DATABASE_URL } from './env.js'
import { Item } from './models/Itemmodel.js'

/* 예외 설정 */
const asyncHandler = (handler) => {
    return async (req, res) => {
        try {
            await handler(req, res)
        } catch (e) {
            switch (e.name) {
                case 'ValidationError':
                    res.status(400).send({ message: e.message })
                    break
                case 'CastError':
                    res.status(404).send({ message: "ID를 찾을 수 없습니다" })
                    break
                default:
                    res.status(500).send({ message: e.message })
                    break
            }
        }
    }
}

const App = express()
App.use(express.json())

/* ----------- */
// 아이템 생성 API
App.post("/items", async (req, res) => {
    const { name, description, price, tags, images, ownerId } = req.body;

    try {
        // 가장 큰 id 값을 찾고 +1 한 값으로 새로운 id 설정
        const lastItem = await Item.findOne().sort({ id: -1 });  // id 내림차순으로 가장 큰 값 찾기
        const newId = lastItem ? lastItem.id + 1 : 1;  // 이전 id가 있으면 +1, 없으면 1로 설정

        // 새로운 아이템 객체 생성
        const newItem = new Item({
            id: newId,
            name,
            description,
            price,
            tags,
            images,
            ownerId,
        });

        // 아이템 저장
        const savedItem = await newItem.save();

        // 성공적인 응답 반환
        res.status(201).json({
            message: "아이템이 성공적으로 생성되었습니다.",
            item: savedItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "아이템 생성 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
});

// 아이템 전체 조회 API
App.get("/items", async (req, res) => {
    try {
        const items = await Item.find();  // 모든 아이템 조회
        res.status(200).json({
            message: "아이템 목록을 성공적으로 조회했습니다.",
            items: items,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "아이템 조회 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
});

// 아이템 수정
App.patch("/items/:id", async (req, res) => {
    const { id } = req.params;  // URL 파라미터에서 id 가져오기
    const updateFields = req.body;  // 요청 본문에서 수정할 필드들 가져오기

    try {
        // id로 아이템을 찾고 부분적으로 수정
        const updatedItem = await Item.findOneAndUpdate(
            { id: id },  // 해당 id를 가진 아이템 찾기
            updateFields,  // 요청 본문에 담긴 필드들로 업데이트
            { new: true }  // 수정된 객체를 반환하도록 설정
        );

        if (!updatedItem) {
            return res.status(404).json({
                message: "아이템을 찾을 수 없습니다.",
            });
        }

        res.status(200).json({
            message: "아이템이 성공적으로 수정되었습니다.",
            item: updatedItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "아이템 수정 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
});

// 아이템 삭제 API
App.delete("/items/:id", async (req, res) => {
    const { id } = req.params;  // URL 파라미터에서 id 가져오기

    try {
        // id로 아이템을 찾아서 삭제
        const deletedItem = await Item.findOneAndDelete({ id: id });

        if (!deletedItem) {
            return res.status(404).json({
                message: "아이템을 찾을 수 없습니다.",
            });
        }

        res.status(200).json({
            message: "아이템이 성공적으로 삭제되었습니다.",
            item: deletedItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "아이템 삭제 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
});

/* ---------- */
mongoose.connect(DATABASE_URL)
    .then(() => console.log('DB 연결이 완료되었습니다.'))

App.listen(3001, () => {
    console.log("서버가 동작 중입니다.")
})

