import React, { useState } from "react";
import { createdProduct } from "../Product/Products"; // 경로는 프로젝트 구조에 맞게 수정

const ProductForm = ({ onSubmit, accessToken }) => {
  const [showModal, setShowModal] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false); // 제출 중 로딩 상태 추가
  const [error, setError] = useState(null); // 오류 상태 추가

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // 이전 오류 리셋

    // 상품 데이터 준비
    const productData = {
      name,
      description,
      price: Number(price),
      tags: tags.split(",").map((tag) => tag.trim()),
      images: images.map((image) => image.name), // 파일 이름만 전송
    };

    const createdProduct = await createdProduct(productData, accessToken);
    if (createdProduct) {
      // 상품 생성 성공 시 처리
      onSubmit(createdProduct); // 새로 생성된 상품을 부모에게 전달 (선택사항)
      setShowModal(false); // 모달 닫기
    }
  };

  // 이미지 파일 선택 처리 (여러 개 파일 처리)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const filePreviews = [];
    const fileNames = [];

    files.forEach((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          filePreviews.push(reader.result); // 이미지 미리보기 데이터
          fileNames.push(file); // 실제 파일 데이터
          setImagePreviews((prevPreviews) => [
            ...prevPreviews,
            ...filePreviews,
          ]);
          setImages((prevImages) => [...prevImages, ...fileNames]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // 이미지 삭제 처리 (이미지 클릭 시)
  const handleImageRemove = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  // 모달 닫기 처리
  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay open">
      <div className="modal-content">
        <button className="close-btn" onClick={handleCloseModal}>
          X
        </button>
        <h3 className="Form-title">상품 등록</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="Form-images-wrap">
              <label className="Form-images-text">상품사진</label>
              <input
                className="Form-images"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                multiple
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-preview">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="image-item"
                    onClick={() => handleImageRemove(index)} // 이미지 클릭 시 삭제
                  >
                    {index === 0 && (
                      <span className="img-span">대표 이미지</span>
                    )}
                    <img src={preview} alt={`상품 이미지 ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="Form-name">
            <label className="Form-name-text">상품명</label>
            <input
              className="Form-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="Form-description">상품 설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="Form-price">가격</label>
            <input
              className="Form-price-input"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="Form-tags">태그 (쉼표로 구분)</label>
            <input
              className="Form-tags-input"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="쉼표로 구분된 태그"
            />
          </div>
          {error && <p className="error-message">{error}</p>}{" "}
          <button type="submit" className="Form-Btn" disabled={loading}>
            {loading ? "등록 중..." : "등록"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
