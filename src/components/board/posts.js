import { Post } from '../../models/post';  // 게시글 모델을 임포트

/* 게시글 생성 */
export const createPost = async (req, res) => {
    try {
        const { name, description, images, ownerId, favoriteCount } = req.body;

        // 필수 필드 체크
        if (!name || !description || !ownerId) {
            return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
        }

        // 마지막 게시글을 찾아서 id 값 구하기
        const lastPost = await Post.findOne().sort({ id: -1 });  // id 필드를 기준으로 내림차순 정렬
        const nextId = lastPost ? lastPost.id + 1 : 1;  // 마지막 id 값을 +1, 없으면 1로 설정

        // nextId가 유효한지 확인
        if (isNaN(nextId) || nextId <= 0) {
            return res.status(400).json({ error: '유효하지 않은 id 값입니다.' });
        }

        const newPost = new Post({
            id: nextId,  // 자동으로 증가된 id 사용
            name,
            description,
            images,
            ownerId,
            favoriteCount: favoriteCount || 0,  // 기본값 0
        });

        // 데이터베이스에 저장
        await newPost.save();

        return res.status(201).json(newPost);  // 생성된 게시글 반환
    } catch (error) {
        console.error('게시글 생성 중 오류:', error);
        return res.status(500).json({ error: '서버 내부 오류' });
    }
};

/* 게시글 조회 (전체 게시글) */
export const getAllPosts = async (req, res) => {
    const {
        sort = 'recent',
        offset = 0,
        pageSize = 10,
        search
    } = req.query;

    // 1. 정렬 조건 설정
    const sortOption = {
        createdAt: sort === 'oldest' ? 1 : -1,  // 오름차순 또는 내림차순
    };

    // 2. 검색 필터 생성
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },  // name에 search가 포함된 글
            { description: { $regex: search, $options: 'i' } }  // description에 search가 포함된 글
        ];
    }

    try {
        // 3. 데이터 조회 쿼리
        const query = Post.find(filter)
            .select('id name description ownerId favoriteCount createdAt')  // 필요한 필드만 선택
            .sort(sortOption)  // 정렬 옵션 적용
            .skip(Number(offset))  // 페이징 처리 (offset만큼 건너뜀)
            .limit(Number(pageSize));  // 한 페이지당 게시글 수 제한

        // 4. 병렬 처리로 성능 향상
        const [posts, totalCount] = await Promise.all([
            query.lean().exec(),  // 게시글 조회
            Post.countDocuments(filter).exec()  // 검색 조건에 맞는 게시글 수 계산
        ]);

        // 5. 응답 데이터 계산 (다음 페이지가 있는지 체크)
        const hasNext = (Number(offset) + Number(pageSize)) < totalCount;

        // 6. 응답 전송
        res.status(200).json({
            posts,
            totalCount,
            hasNext,
            nextOffset: hasNext ? Number(offset) + Number(pageSize) : null  // 다음 페이지로 이동할 offset
        });

    } catch (error) {
        console.error(`게시글 조회 중 오류: ${error.message}`);
        res.status(500).json({
            error: '서버 오류 발생',
            details: error.message
        });
    }
};

/* 특정 게시글 조회 */
export const getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findOne({ id });

        if (!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error(`게시글 조회 중 오류: ${error.message}`);
        res.status(500).json({
            error: '서버 오류 발생',
            details: error.message
        });
    }
};

/* 게시글 수정 */
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { name, description, images, favoriteCount } = req.body;

    try {
        const post = await Post.findOne({ id });

        if (!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }

        // 수정할 필드가 있으면 업데이트
        if (name) post.name = name;
        if (description) post.description = description;
        if (images) post.images = images;
        if (favoriteCount !== undefined) post.favoriteCount = favoriteCount;  // favoriteCount가 0일 수 있으므로 undefined 체크

        await post.save();  // 변경된 내용을 DB에 저장

        return res.status(200).json(post);  // 수정된 게시글 반환
    } catch (error) {
        console.error(`게시글 수정 중 오류: ${error.message}`);
        res.status(500).json({
            error: '서버 오류 발생',
            details: error.message
        });
    }
};

/* 게시글 삭제 */
export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findOneAndDelete({ id });

        if (!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }

        return res.status(200).json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
        console.error(`게시글 삭제 중 오류: ${error.message}`);
        res.status(500).json({
            error: '서버 오류 발생',
            details: error.message
        });
    }
};

/* 게시글 전체 삭제 */
export const deleteAllPosts = async (req, res) => {
    try {
        const result = await Post.deleteMany({});

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: '삭제할 게시글이 없습니다.' });
        }

        return res.status(200).json({ message: `${result.deletedCount}개의 게시글이 삭제되었습니다.` });
    } catch (error) {
        console.error(`게시글 전체 삭제 중 오류: ${error.message}`);
        res.status(500).json({
            error: '서버 오류 발생',
            details: error.message
        });
    }
};