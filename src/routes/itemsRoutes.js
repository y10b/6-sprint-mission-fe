import express from 'express';
import { Product } from '../models/Productmodel.js';
import { asyncHandler } from '../components/Product/asset/asyncHandler.js';  // 예외 처리 미들웨어

const router = express.Router();

// 모든 아이템 조회 (Pagination과 검색 지원)
router.get('/items', asyncHandler(async (req, res) => {
    const { offset = 0, pageSize = 10, sort = 'recent', search } = req.query;

    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const sortOption = {
        createdAt: sort === 'oldest' ? 1 : -1
    };

    const [items, totalCount] = await Promise.all([
        Product.find(filter)
            .select('id name price createdAt')
            .sort(sortOption)
            .skip(Number(offset))
            .limit(Number(pageSize))
            .lean(),
        Product.countDocuments(filter)
    ]);

    const hasNext = (Number(offset) + Number(pageSize)) < totalCount;
    const nextOffset = hasNext ? Number(offset) + Number(pageSize) : null;

    res.status(200).json({ items, totalCount, hasNext, nextOffset });
}));

// 상품 추가
router.post('/items', asyncHandler(async (req, res) => {
    const { name, description, price, tags } = req.body;

    // 필수 입력값 확인
    if (!name || !description || !price || !tags) {
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 새로운 상품 생성
    const newProduct = new Product({
        name,
        description,
        price,
        tags,
        favoriteCount: 0, // 기본값으로 좋아요 수 0
        createdAt: new Date(),
    });

    // 상품 저장
    await newProduct.save();

    // 성공적인 응답
    res.status(201).json({ message: '상품이 성공적으로 등록되었습니다.', product: newProduct });
}));

// 좋아요 증가
router.post('/items/:id/increaseFavorite', asyncHandler(async (req, res) => {
    const itemId = req.params.id;

    // 상품 아이템 찾기
    const item = await Product.findOne({ id: itemId });

    if (!item) {
        return res.status(404).send({ message: "아이템을 찾을 수 없습니다." });
    }

    // favoriteCount가 존재하면 1 증가
    item.favoriteCount = item.favoriteCount ? item.favoriteCount + 1 : 1;

    // 변경된 데이터 저장
    await item.save();

    // 응답
    res.status(200).send(item);
}));

// 좋아요 감소
router.post('/items/:id/decreaseFavorite', asyncHandler(async (req, res) => {
    const itemId = req.params.id;

    const item = await Product.findOne({ id: itemId });

    if (!item) {
        return res.status(404).send({ message: "아이템을 찾을 수 없습니다." });
    }

    item.favoriteCount = item.favoriteCount > 0 ? item.favoriteCount - 1 : 0;

    await item.save();

    res.status(200).send(item);
}));

export default router;
