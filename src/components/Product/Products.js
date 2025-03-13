import { Product } from '../../models/Productmodel.js'; // Item 모델 임포트
import { asyncHandler } from './utils/asyncHandler.js'; // 예외 처리 함수 임포트

// 아이템 추가
export const createItemAPI = asyncHandler(async (req, res) => {
  const { name, description, price, ownerId, tags, images, totalCount } = req.body;

  // 필수 필드 확인
  if (!name || !description || !price || !tags) {
    return res.status(400).send({ message: "필수 필드가 누락되었습니다." });
  }

  try {
    // 마지막 아이템을 찾아서, 그 아이템의 id에 +1을 하여 새로운 id 생성
    const lastItem = await Product.findOne().sort({ id: -1 }); // id 내림차순으로 마지막 아이템 찾기
    const newId = lastItem ? lastItem.id + 1 : 1; // 만약 아이템이 없다면 id는 1로 시작

    // 아이템 생성
    const item = await Product.create({
      id: newId,
      name,
      description,
      price,
      ownerId,
      tags,
      images,
      totalCount
    });

    res.status(201).send(item); // 생성된 아이템 반환
  } catch (error) {
    console.error(error); // 서버 로그에 오류 출력
    res.status(500).send({ message: error.message });
  }
});

// 모든 아이템 조회
export const getAllItemsAPI = asyncHandler(async (req, res) => {
  const {
    sort = 'recent',
    offset = 0,
    pageSize = 10,
    search
  } = req.query;

  // 1. 정렬 조건 설정
  const sortOption = {
    createdAt: sort === 'oldest' ? 1 : -1, // 1: 오름차순, -1: 내림차순
  };

  // 2. 검색 필터 생성
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    // 3. 데이터 조회 쿼리
    const query = Product.find(filter)
      .select('id name price createdAt')
      .sort(sortOption)
      .skip(Number(offset))
      .limit(Number(pageSize));

    // 4. 병렬 처리로 성능 향상
    const [items, totalCount] = await Promise.all([
      query.lean().exec(),
      Product.countDocuments(filter).exec()
    ]);

    // 5. 응답 데이터 계산
    const hasNext = (Number(offset) + Number(pageSize)) < totalCount;

    res.status(200).json({
      items,
      totalCount,
      hasNext,
      nextOffset: hasNext ? Number(offset) + Number(pageSize) : null
    });

  } catch (error) {
    console.error(`API Error: ${error.message}`);
    res.status(500).json({
      error: '서버 오류 발생',
      details: error.message
    });
  }
});

// 특정 아이템 조회
export const getItemByIdAPI = asyncHandler(async (req, res) => {
  const itemId = req.params.id; // URL 파라미터에서 id 가져오기

  try {
    // 데이터베이스에서 id로 아이템 찾기
    const item = await Product.findOne({ id: itemId });

    if (!item) {
      // 아이템이 없으면 404 상태와 메시지 반환
      return res.status(404).send({ message: "아이템을 찾을 수 없습니다." });
    }

    // 아이템이 존재하면 반환
    res.status(200).send(item);
  } catch (error) {
    console.error(error); // 서버 로그에 오류 출력
    res.status(500).send({ message: error.message });
  }
});

// 특정 아이템 수정
export const updateItemAPI = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const { name, description, price, tags, images, totalCount } = req.body;

  const item = await Product.findOne({ id: itemId });

  if (!item) {
    return res.status(404).send({ message: "아이템을 찾을 수 없습니다." });
  }

  if (name) item.name = name;
  if (description) item.description = description;
  if (price) item.price = price;
  if (tags) item.tags = tags;
  if (images) item.images = images;
  if (totalCount) item.totalCount = totalCount;

  await item.save();
  res.status(200).send(item);
});

// 특정 아이템 삭제
export const deleteItemAPI = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const item = await Product.findOneAndDelete({ id: id });

  if (!item) {
    return res.status(404).send({ message: '아이템을 찾을 수 없습니다.' });
  }

  res.sendStatus(204);
});

// 모든 아이템 삭제
export const deleteAllItemsAPI = asyncHandler(async (req, res) => {
  await Product.deleteMany({});
  res.sendStatus(204);
});

// 특정 아이템 좋아요 카운트 증가
export const increaseFavoriteCountAPI = asyncHandler(async (req, res) => {
  const itemId = req.params.id; // URL 파라미터에서 아이템 ID 가져오기

  try {
    // 해당 아이템 찾기
    const item = await Product.findOne({ id: itemId });

    if (!item) {
      return res.status(404).send({ message: "아이템을 찾을 수 없습니다." });
    }

    // favoriteCount 증가
    item.favoriteCount = item.favoriteCount ? item.favoriteCount + 1 : 1;

    // 변경된 아이템 저장
    await item.save();

    res.status(200).send(item); // 변경된 아이템 반환
  } catch (error) {
    console.error(error); // 오류 로그 출력
    res.status(500).send({ message: error.message });
  }
});

// 특정 아이템 좋아요 카운트 감소
export const decreaseFavoriteCountAPI = asyncHandler(async (req, res) => {
  const itemId = req.params.id; // URL 파라미터에서 아이템 ID 가져오기

  try {
    // 해당 아이템 찾기
    const item = await Product.findOne({ id: itemId });

    if (!item) {
      return res.status(404).send({ message: "아이템을 찾을 수 없습니다." });
    }

    // favoriteCount 감소 (최소 0 이상으로 유지)
    item.favoriteCount = item.favoriteCount > 0 ? item.favoriteCount - 1 : 0;

    // 변경된 아이템 저장
    await item.save();

    res.status(200).send(item); // 변경된 아이템 반환
  } catch (error) {
    console.error(error); // 오류 로그 출력
    res.status(500).send({ message: error.message });
  }
});
