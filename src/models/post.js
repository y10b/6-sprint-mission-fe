import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,  // id가 고유해야 하므로 unique 설정
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [{
        type: String,  // 배열 안에 이미지 URL을 문자열로 저장
    }],
    ownerId: {
        type: Number,
        required: true,
    },
    favoriteCount: {
        type: Number,
        default: 0,  // 기본값을 0으로 설정
    }
}, {
    timestamps: true,  // createdAt, updatedAt 자동 관리
});

export const Post = mongoose.model("Post", PostSchema);
