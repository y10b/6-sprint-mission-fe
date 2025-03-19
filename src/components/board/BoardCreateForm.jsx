import React, { useState } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./css/BoardCreateForm.css";

const BoardCreateForm = () => {
  const [imagePreviews, setImagePreviews] = useState([]); // 여러 이미지 미리보기를 위한 상태
  const [title, setTitle] = useState(""); // 제목 상태
  const [description, setDescription] = useState(""); // 내용 상태
  const [titleError, setTitleError] = useState(""); // 제목 오류 메시지 상태
  const [descriptionError, setDescriptionError] = useState(""); // 내용 오류 메시지 상태

  // 제목 유효성 검사
  const validateTitle = (title) => {
    const trimmedTitle = title.trim().replace(/\s/g, ""); // 띄어쓰기 제거
    if (trimmedTitle.length === 0) {
      return "제목을 입력해주세요.";
    }
    if (trimmedTitle.length > 10) {
      return "제목은 10자 이하이어야 합니다.";
    }
    return "";
  };

  // 내용 유효성 검사
  const validateDescription = (description) => {
    const trimmedDescription = description.trim();
    if (trimmedDescription.length > 100) {
      return "내용은 100자 이하이어야 합니다.";
    }
    return "";
  };

  // 파일을 선택했을 때 미리보기를 업데이트하는 함수
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length <= 6) {
      const newPreviews = files.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newPreviews).then((newImages) => {
        setImagePreviews((prevImages) => [...prevImages, ...newImages]);
      });
    } else {
      alert("최대 6개까지 이미지를 등록할 수 있습니다.");
    }
  };

  // 클릭한 이미지 삭제 함수
  const handleImageDelete = (index) => {
    setImagePreviews((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // 폼 제출 시 유효성 검사 및 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    const titleErrorMessage = validateTitle(title);
    const descriptionErrorMessage = validateDescription(description);

    setTitleError(titleErrorMessage);
    setDescriptionError(descriptionErrorMessage);

    if (titleErrorMessage || descriptionErrorMessage) {
      return; // 유효성 검사 실패 시 제출을 막음
    }

    // 유효성 검사 통과 시 추가적인 로직 (예: 폼 제출)
    console.log("제목:", title);
    console.log("내용:", description);
    console.log("등록된 이미지:", imagePreviews);
  };

  return (
    <>
      <Header />
      <div className="boardForm">
        <form onSubmit={handleSubmit}>
          <div className="boardHeader">
            <h2>게시글 쓰기</h2>
            <button type="submit" className="boardBtn">
              등록
            </button>
          </div>
          <div className="formGroup">
            <label className="boardTitle">*제목</label>
            <input
              className="boardTitleInput"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleError && <p className="errorMessage">{titleError}</p>}
          </div>
          <div className="formGroup">
            <label className="boardDescription">*내용</label>
            <textarea
              className="boardDescriptionTextara"
              placeholder="내용을 입력해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {descriptionError && (
              <p className="errorMessage">{descriptionError}</p>
            )}
          </div>
          <div className="formGroupImg">
            <label className="boardImg">이미지</label>
            <div className="imagePreviewContainer">
              <div className="imageInput">
                {imagePreviews.length < 6 && (
                  <input
                    type="file"
                    accept=".png,.jpg"
                    multiple
                    className="boardImgInput"
                    id="file-input"
                    onChange={handleImageChange}
                  />
                )}
                <label htmlFor="file-input" className="boardImgLabel">
                  이미지 등록
                </label>
              </div>
              {imagePreviews.map((preview, index) => (
                <div key={index} className="imagePreviewWrapper">
                  {index === 0 && (
                    <div className="representativeTag">대표 사진</div>
                  )}
                  <img
                    src={preview}
                    alt={`미리보기 ${index + 1}`}
                    className="imagePreview"
                    onClick={() => handleImageDelete(index)} // 이미지 클릭 시 삭제
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default BoardCreateForm;
