import express from 'express';
import { Product } from '../models/Productmodel.js';
import { asyncHandler } from '../components/Product/asset/asyncHandler.js';  // 예외 처리 미들웨어

const itemsRoute = express.Router();

// 모든 아이템 조회 (Pagination과 검색 지원)
itemsRoute.get('/', asyncHandler(async (req, res) => {
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
itemsRoute.post('/', asyncHandler(async (req, res) => {

    console.log(req.body)

    const { name, description, price, tags } = req.body;

    if (!name || !description || !price || !tags) {
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            tags,
            favoriteCount: 0,
        });

        await newProduct.save();

        res.status(201).json({
            message: '상품이 성공적으로 등록되었습니다.',
            product: newProduct,
        });
    } catch (error) {
        console.error("상품 등록 실패", error);
        res.status(500).json({ message: "상품 등록에 실패했습니다.", error: error.message });
    }
}));

// 좋아요 증가
itemsRoute.post('/:id/increaseFavorite', asyncHandler(async (req, res) => {
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
itemsRoute.post('/:id/decreaseFavorite', asyncHandler(async (req, res) => {
    const itemId = req.params.id;

    const item = await Product.findOne({ id: itemId });

    if (!item) {
        return res.status(404).send({ message: "아이템을 찾을 수 없습니다." });
    }

    item.favoriteCount = item.favoriteCount > 0 ? item.favoriteCount - 1 : 0;

    await item.save();

    res.status(200).send(item);
}));

export default itemsRoute;
