"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput"; // FormInput 컴포넌트 import
import {
  validateProductName,
  validateDescription,
  validatePrice,
  validateTags,
} from "@/utils/validation";
import { createProduct } from "@/app/api/products/createProduct"; // api.js에서 import

function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [tagList, setTagList] = useState([]); // 태그 리스트 추가
  const router = useRouter();

  const checkAuthToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요한 페이지입니다.");
      router.push("/signin");
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (field === "name") {
        if (!validateProductName(value)) {
          newErrors.name = "상품명은 2자 이상 15자 이하로 입력해주세요.";
        } else {
          delete newErrors.name;
        }
      }

      if (field === "description") {
        if (!validateDescription(value)) {
          newErrors.description =
            "상품 소개는 10자 이상 100자 이하로 입력해주세요.";
        } else {
          delete newErrors.description;
        }
      }

      if (field === "price") {
        if (!validatePrice(value)) {
          newErrors.price = "가격은 0보다 커야 합니다.";
        } else {
          delete newErrors.price;
        }
      }

      if (field === "tags") {
        if (!validateTags(value)) {
          newErrors.tags = "태그는 1개 이상 입력해주세요.";
        } else {
          delete newErrors.tags;
        }
      }

      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!validateProductName(form.name)) {
      newErrors.name = "상품명은 2자 이상 15자 이하로 입력해주세요.";
    }
    if (!validateDescription(form.description)) {
      newErrors.description =
        "상품 소개는 10자 이상 100자 이하로 입력해주세요.";
    }
    if (!validatePrice(form.price)) {
      newErrors.price = "가격은 0보다 커야 합니다.";
    }
    if (tagList.length < 1) {
      newErrors.tags = "태그는 1개 이상 입력해주세요.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요한 페이지입니다.");
        router.push("/signin");
        return;
      }

      // POST 요청을 보내기 위한 데이터 준비
      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price), // 가격은 숫자로 처리
        tags: tagList, // tags를 배열로 전송
        images: [], // 예시로 빈 배열을 전달, 실제 이미지 URL 또는 파일 업로드 처리 필요
      };

      // API 호출
      const response = await createProduct(productData);

      if (response && response.success) {
        console.log("상품 등록 성공", response.data);
        router.push(`/products/${response.data.id}`); // 등록된 상품 페이지로 이동
      } else {
        console.error("상품 등록 실패", response.error);
      }
    }
  };

  useEffect(() => {
    checkAuthToken();
    const isFormValid =
      validateProductName(form.name) &&
      validateDescription(form.description) &&
      validatePrice(form.price) &&
      tagList.length > 0; // 태그가 1개 이상이어야 한다면
    setIsValid(isFormValid);
  }, [form, tagList]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && form.tags.trim() !== "" && tagList.length < 5) {
      e.preventDefault(); // 엔터 키로 폼 제출을 방지
      const newTag = form.tags.trim();
      if (!tagList.includes(newTag)) {
        setTagList((prevTags) => [...prevTags, newTag]);
        setForm((prevForm) => ({ ...prevForm, tags: "" })); // 입력 필드 비우기
      }
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTagList((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sm:w-[696px] md:w-300 mx-auto mt-6 w-[344px]"
    >
      <div className="flex justify-between">
        <h3 className="font-bold text-[20px] text-gray-800">상품 등록하기</h3>
        <button
          type="submit"
          disabled={!isValid}
          className={`w-[74px] rounded-xl py-3 px-[23px] font-semibold text-base text-white ${
            isValid
              ? "bg-blue-500 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          등록
        </button>
      </div>

      {/* 상품명 */}
      <FormInput
        label="상품명"
        value={form.name}
        onChange={handleChange("name")}
        placeholder="상품명을 입력해주세요"
        error={errors.name}
      />

      {/* 상품 소개 */}
      <FormInput
        label="상품 소개"
        type="textarea"
        value={form.description}
        onChange={handleChange("description")}
        placeholder="상품 소개를 입력해주세요"
        error={errors.description}
      />

      {/* 판매 가격 */}
      <FormInput
        label="판매가격"
        type="number"
        value={form.price}
        onChange={handleChange("price")}
        placeholder="판매 가격을 입력해주세요"
        error={errors.price}
      />

      {/* 태그 */}
      <div>
        <label className="block mt-6 font-bold text-[18px] text-secondary-800">
          태그
        </label>
        <input
          type="text"
          value={form.tags}
          onChange={handleChange("tags")}
          onKeyDown={handleKeyDown} // 엔터 키 입력을 처리하는 함수
          className={`mt-4 w-full h-14 rounded-[12px] py-4 px-6 bg-gray-100 placeholder:text-secondary-400 ${
            errors.tags ? "border border-red-500" : ""
          }`}
          placeholder="태그를 입력해주세요"
          disabled={tagList.length >= 5} // 태그가 5개 이상일 경우 입력 필드 비활성화
        />
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
        )}
        <div className="mt-[14px] gap-3">
          {tagList.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center font-normal text-base leading-[26px] text-secondary-800 mr-2 px-3 py-[6px] bg-gray-100 rounded-full"
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => handleTagDelete(tag)}
                className="cursor-pointer ml-2 bg-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-center text-secondary-100"
              >
                x
              </button>
            </span>
          ))}
        </div>
      </div>
    </form>
  );
}

export default CreateProduct;
