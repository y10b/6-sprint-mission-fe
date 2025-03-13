import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/CreateProduct.css";

const CreateProduct = () => {
  const [name, setName] = useState(""); // 상품명
  const [description, setDescription] = useState(""); // 상품 설명
  const [price, setPrice] = useState(""); // 가격
  const [tags, setTags] = useState(""); // 태그
  const navigate = useNavigate(); // 상품 등록 후 페이지 이동을 위한 navigate 함수

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 유효성 검사 (선택 사항)
    if (!name || !description || !price || !tags) {
      alert("모든 필드를 채워주세요!");
      return;
    }

    const newProduct = {
      name,
      description,
      price: parseInt(price),
      tags: tags.split(",").map((tag) => tag.trim()), // 태그는 쉼표로 구분된 배열로 저장
    };

    try {
      // 상품 등록 API 호출
      await axios.post("http://localhost:3002/api/items", newProduct, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 성공적으로 등록된 후 홈 또는 목록 페이지로 이동
      navigate("/items");
    } catch (error) {
      console.error("상품 등록 실패", error);
      alert("상품 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <Header />
      <div className="create-product-form">
        <div className="create-header">
          <h2 className="create-text">상품 등록하기</h2>
          <button type="submit" className="create-btn">
            등록
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="create-name">상품명</label>
            <input
              className="create-name-input"
              type="text"
              placeholder="상품명을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="create-description">상품 소개</label>
            <textarea
              className="create-description-textarea"
              value={description}
              placeholder="상품소개를 입력해주세요"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="create-price">판매 가격</label>
            <input
              className="create-price-input"
              placeholder="판매가격을 입력해주세요"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="create-tag">태그 (쉼표로 구분)</label>
            <input
              className="create-tag-input"
              placeholder="태그를 입력해주세요"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateProduct;
