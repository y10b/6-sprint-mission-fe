import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import itemsRoutes from './routes/itemsRoutes.js';  // 라우터 불러오기
import { DATABASE_URL } from '../env.js';

dotenv.config();

const App = express();
const PORT = process.env.PORT || 3002;

// CORS 미들웨어 설정 - 반드시 가장 상단에 위치
const corsOptions = {
    origin: 'http://localhost:3000',  // React 애플리케이션 주소
    credentials: true,  // 쿠키를 포함한 요청 허용
};

// CORS 미들웨어 적용
App.use(cors(corsOptions));

App.use(express.json());

// MongoDB 연결
mongoose.connect(DATABASE_URL)
    .then(() => console.log('MongoDB 연결 성공'))
    .catch(err => console.error('MongoDB 연결 실패:', err));

// API 엔드포인트 라우터 등록
App.use('/api', itemsRoutes);  // '/api' 경로로 시작하는 모든 요청을 itemsRoutes로 처리

App.listen(PORT, () => {
    console.log(`서버가 동작 중입니다. 포트: ${PORT}`);
});
