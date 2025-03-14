import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFormValidation from "../Product/asset/useFormValidation";
import "./css/CreateProduct.css";

const CreateProduct = () => {
  const [name, setName] = useState(""); // 상품명
  const [description, setDescription] = useState(""); // 상품 설명
  const [price, setPrice] = useState(""); // 가격
  const [tags, setTags] = useState([]); // 태그 배열로 상태 관리
  const [inputTag, setInputTag] = useState(""); // 태그 입력값
  const navigate = useNavigate();

  // Use custom hook for validation
  const {
    nameError,
    descriptionError,
    priceError,
    tagsError,
    validateName,
    validateDescription,
    validatePrice,
    validateTags,
    isFormValid,
  } = useFormValidation();

  // 태그 입력 처리 및 중복 제거
  const handleTagInput = (e) => {
    setInputTag(e.target.value);
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" && inputTag.trim() !== "") {
      e.preventDefault();
      const newTag = `#${inputTag.trim()}`;
      setTags((prevTags) => {
        // 중복 제거: 새로운 태그가 이미 존재하지 않으면 추가
        if (!prevTags.includes(newTag)) {
          return [...prevTags, newTag];
        }
        return prevTags;
      });
      validateTags([...tags, newTag]); // Validate tags after adding
      setInputTag(""); // 입력 필드 초기화
    }
  };

  // 태그 삭제
  const handleTagRemove = (tagToRemove) => {
    setTags((prevTags) => {
      const updatedTags = prevTags.filter((tag) => tag !== tagToRemove);
      validateTags(updatedTags); // Re-validate tags after removing
      return updatedTags;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 각 필드의 유효성 검사
    const validName = validateName(name);
    const validDescription = validateDescription(description);
    const validPrice = validatePrice(price);
    const validTags = validateTags(tags);

    // 유효하지 않으면 등록을 진행하지 않음
    if (!validName || !validDescription || !validPrice || !validTags) {
      return;
    }

    const newProduct = {
      name,
      description,
      price: parseInt(price),
      tags, // 이미 배열로 저장된 태그들
    };

    try {
      // 상품 등록 API 호출
      const response = await axios.post(
        "http://localhost:3002/api/items",
        newProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 성공적인 등록 후 알림 표시
      alert(response.data.message); // 성공 메시지
      navigate("/items"); // 상품 목록 페이지로 이동
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
          <button
            type="submit"
            className="create-btn"
            disabled={!isFormValid()} // 버튼 비활성화 조건
          >
            등록
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="create-name">상품명</label>
            <input
              className={`create-name-input ${nameError ? "error" : ""}`}
              type="text"
              placeholder="상품명을 입력해주세요"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateName(e.target.value);
              }}
            />
            {nameError && <p className="error-message">{nameError}</p>}
          </div>

          <div className="form-group">
            <label className="create-description">상품 소개</label>
            <textarea
              className={`create-description-textarea ${
                descriptionError ? "error" : ""
              }`}
              value={description}
              placeholder="상품소개를 입력해주세요"
              onChange={(e) => {
                setDescription(e.target.value);
                validateDescription(e.target.value);
              }}
            />
            {descriptionError && (
              <p className="error-message">{descriptionError}</p>
            )}
          </div>

          <div className="form-group">
            <label className="create-price">판매 가격</label>
            <input
              className={`create-price-input ${priceError ? "error" : ""}`}
              placeholder="판매가격을 입력해주세요"
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                validatePrice(e.target.value); // Validate on change
              }}
            />
            {priceError && <p className="error-message">{priceError}</p>}
          </div>

          <div className="form-group">
            <label className="create-tag">태그</label>
            <div className="tag-input-container">
              <input
                className={`create-tag-input ${tagsError ? "error" : ""}`}
                placeholder="태그를 입력해주세요"
                type="text"
                value={inputTag}
                onChange={handleTagInput}
                onKeyDown={handleTagKeyPress}
              />
              <div className="create-tag-list">
                {tags.map((tag, index) => (
                  <div key={index} className="create-tag-item">
                    {tag}
                    <button
                      type="button"
                      className="remove-tag-btn"
                      onClick={() => handleTagRemove(tag)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {tagsError && <p className="error-message">{tagsError}</p>}
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateProduct;
