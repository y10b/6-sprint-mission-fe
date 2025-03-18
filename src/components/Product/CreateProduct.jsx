import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validateProduct } from "../Product/asset/ValidationMiddleware";
import "./css/CreateProduct.css";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();

  // 모든 유효성 검사 상태 업데이트
  const updateValidationErrors = () => {
    const validationErrors = validateProduct(name, description, price, tags);
    setNameError(validationErrors.nameError);
    setDescriptionError(validationErrors.descriptionError);
    setPriceError(validationErrors.priceError);
    setTagsError(validationErrors.tagsError);
  };

  // 모든 유효성 검사 통과 여부 확인
  const isFormValid = () => {
    return (
      nameError === "" &&
      descriptionError === "" &&
      priceError === "" &&
      tagsError === "" &&
      name.trim() !== "" &&
      description.trim() !== "" &&
      price > 0 &&
      tags.length > 0
    );
  };

  // 유효성 검사 상태 업데이트
  useEffect(() => {
    updateValidationErrors();
    setFormValid(isFormValid());
  }, [
    name,
    description,
    price,
    tags,
    nameError,
    descriptionError,
    priceError,
    tagsError,
  ]);

  // 태그 입력 처리 및 중복 제거
  const handleTagInput = (e) => {
    setInputTag(e.target.value);
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" && inputTag.trim() !== "") {
      e.preventDefault();
      const newTag = `#${inputTag.trim()}`;
      setTags((prevTags) => {
        if (!prevTags.includes(newTag)) {
          return [...prevTags, newTag];
        }
        return prevTags;
      });
      updateValidationErrors(); // 태그 추가 후 유효성 검사
      setInputTag(""); // 입력 필드 초기화
    }
  };

  // 태그 삭제
  const handleTagRemove = (tagToRemove) => {
    setTags((prevTags) => {
      const updatedTags = prevTags.filter((tag) => tag !== tagToRemove);
      updateValidationErrors(); // 태그 삭제 후 유효성 검사
      return updatedTags;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 각 필드의 유효성 검사
    updateValidationErrors();

    // 유효하지 않으면 등록을 진행하지 않음
    if (!isFormValid()) {
      console.log("유효성 검사 실패");
      return;
    }

    // price가 NaN이 아니도록 처리
    const parsedPrice = parseInt(price, 10);
    if (isNaN(parsedPrice)) {
      setPriceError("가격은 유효한 숫자여야 합니다.");
      return;
    }

    const newProduct = {
      name,
      description,
      price: parsedPrice,
      tags,
    };

    console.log("입력한 상품은:", newProduct);

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
      console.log(response.data);
      navigate("/items"); // 상품 목록 페이지로 이동
    } catch (error) {
      console.error("상품 등록 실패", error);
      alert("상품 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <Header />
      <div className="createProductForm">
        <form onSubmit={handleSubmit}>
          <div className="createHeader">
            <h2 className="createText">상품 등록하기</h2>
            <button
              type="submit"
              className="createBtn"
              disabled={!formValid} // 버튼 비활성화 조건
            >
              등록
            </button>
          </div>

          <div className="formGroup">
            <label className="createName">상품명</label>
            <input
              className={`createNameInput ${nameError ? "error" : ""}`}
              type="text"
              placeholder="상품명을 입력해주세요"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                updateValidationErrors(); // 상품명 유효성 검사
              }}
            />
            {nameError && <p className="errorMessage">{nameError}</p>}
          </div>

          <div className="formGroup">
            <label className="createDescription">상품 소개</label>
            <textarea
              className={`createDescriptionTextarea ${
                descriptionError ? "error" : ""
              }`}
              value={description}
              placeholder="상품소개를 입력해주세요"
              onChange={(e) => {
                setDescription(e.target.value);
                updateValidationErrors(); // 상품 소개 유효성 검사
              }}
            />
            {descriptionError && (
              <p className="errorMessage">{descriptionError}</p>
            )}
          </div>

          <div className="formGroup">
            <label className="createPrice">판매 가격</label>
            <input
              className={`createPriceInput ${priceError ? "error" : ""}`}
              placeholder="판매가격을 입력해주세요"
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value); // 숫자로 변환하도록 수정
                updateValidationErrors(); // 가격 유효성 검사
              }}
            />
            {priceError && <p className="errorMessage">{priceError}</p>}
          </div>

          <div className="formGroup">
            <label className="createTag">태그</label>
            <div className="tagInputContainer">
              <input
                className={`createTagInput ${tagsError ? "error" : ""}`}
                placeholder="태그를 입력해주세요"
                type="text"
                value={inputTag}
                onChange={handleTagInput}
                onKeyDown={handleTagKeyPress} // Enter 키로 태그 추가
              />
              <div className="createTagList">
                {tags.map((tag, index) => (
                  <div key={index} className="createTagItem">
                    {tag}
                    <button
                      type="button"
                      className="removeTagBtn"
                      onClick={() => handleTagRemove(tag)} // 태그 삭제
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {tagsError && <p className="errorMessage">{tagsError}</p>}
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateProduct;
