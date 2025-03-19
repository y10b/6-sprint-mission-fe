import express from 'express';
import { Post } from '../models/post.js';  // 게시글 모델을 임포트
import { asyncHandler } from '../components/Product/asset/asyncHandler.js';

const postsRouter = express.Router();

// 모든 게시글 조회 (Pagination과 검색 지원)
postsRouter.get('/', asyncHandler(async (req, res) => {
    const { offset = 0, pageSize = 10, sort = 'recent', search } = req.query;

    const filter = {};
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },  // title에 search가 포함된 글
            { description: { $regex: search, $options: 'i' } }  // description에 search가 포함된 글
        ];
    }

    const sortOption = {
        createdAt: sort === 'oldest' ? 1 : -1  // 'oldest'일 경우 오름차순, 기본 내림차순
    };

    const [posts, totalCount] = await Promise.all([
        Post.find(filter)
            .select('id title description createdAt favoriteCount')  // 필요한 필드만 선택
            .sort(sortOption)
            .skip(Number(offset))  // 페이징 처리
            .limit(Number(pageSize))  // 페이지 당 게시글 수
            .lean(),
        Post.countDocuments(filter)
    ]);

    const hasNext = (Number(offset) + Number(pageSize)) < totalCount;  // 다음 페이지가 있는지 확인
    const nextOffset = hasNext ? Number(offset) + Number(pageSize) : null;

    res.status(200).json({ posts, totalCount, hasNext, nextOffset });
}));

// 게시글 추가
postsRouter.post('/', asyncHandler(async (req, res) => {
    const { title, description, ownerId, favoriteCount } = req.body;

    if (!title || !description || !ownerId) {
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    try {
        const newPost = new Post({
            title,
            description,
            ownerId,
            favoriteCount: favoriteCount || 0,  // 기본값 0
        });

        await newPost.save();

        res.status(201).json({
            message: '게시글이 성공적으로 등록되었습니다.',
            post: newPost,
        });
    } catch (error) {
        console.error("게시글 등록 실패", error);
        res.status(500).json({ message: "게시글 등록에 실패했습니다.", error: error.message });
    }
}));

// 게시글 좋아요 증가
postsRouter.post('/:id/increaseFavorite', asyncHandler(async (req, res) => {
    const postId = req.params.id;

    // 게시글 찾기
    const post = await Post.findOne({ id: postId });

    if (!post) {
        return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    // favoriteCount 증가
    post.favoriteCount = post.favoriteCount ? post.favoriteCount + 1 : 1;

    // 변경된 게시글 저장
    await post.save();

    res.status(200).send(post);
}));

// 게시글 좋아요 감소
postsRouter.post('/:id/decreaseFavorite', asyncHandler(async (req, res) => {
    const postId = req.params.id;

    // 게시글 찾기
    const post = await Post.findOne({ id: postId });

    if (!post) {
        return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    // favoriteCount 감소 (최소 0)
    post.favoriteCount = post.favoriteCount > 0 ? post.favoriteCount - 1 : 0;

    await post.save();

    res.status(200).send(post);
}));

// 특정 게시글 조회
postsRouter.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findOne({ id });

    if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json(post);
}));

// 게시글 수정
postsRouter.put('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, favoriteCount } = req.body;

    const post = await Post.findOne({ id });

    if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 수정할 필드가 있으면 업데이트
    if (title) post.title = title;
    if (description) post.description = description;
    if (favoriteCount !== undefined) post.favoriteCount = favoriteCount;  // favoriteCount는 0일 수 있기 때문에 undefined 체크

    await post.save();

    res.status(200).json(post);
}));

// 게시글 삭제
postsRouter.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findOneAndDelete({ id });

    if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '게시글이 삭제되었습니다.' });
}));

// 모든 게시글 삭제
postsRouter.delete('/', asyncHandler(async (req, res) => {
    const result = await Post.deleteMany({});

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: '삭제할 게시글이 없습니다.' });
    }

    res.status(200).json({ message: `${result.deletedCount}개의 게시글이 삭제되었습니다.` });
}));

export default postsRouter;
