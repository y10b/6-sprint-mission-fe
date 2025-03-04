import React, { useState } from "react";

const ProductForm = ({ onSubmit }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [tags, setTags] = useState("");
    const [images, setImages] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = {
            name,
            description,
            price: Number(price),
            tags: tags.split(",").map((tag) => tag.trim()), // 쉼표로 구분된 태그 처리
            images, // 이미지 URL 목록 (여기서는 이미지를 업로드하는 기능을 구현할 수도 있음)
        };

        onSubmit(productData); // 상품 생성 API 호출
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>상품 등록</h3>
            <div>
                <label>상품명</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>상품 설명</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>가격</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>태그</label>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="쉼표로 구분된 태그"
                />
            </div>
            <div>
                <label>상품 이미지 URL</label>
                <input
                    type="text"
                    value={images}
                    onChange={(e) => setImages([e.target.value])} // 이미지 URL 하나만 받는 예시
                />
            </div>
            <button type="submit">등록</button>
        </form>
    );
};

export default ProductForm;
