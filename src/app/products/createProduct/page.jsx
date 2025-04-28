"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import {
  validateProductName,
  validateDescription,
  validatePrice,
  validateTags,
} from "@/utils/validation";
import { createProduct } from "@/features/products/services/productsApi";

const initialForm = { name: "", description: "", price: "", tags: "" };

export default function CreateProduct() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [tagList, setTagList] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요한 페이지입니다.");
      router.push("/signin");
    }
  }, [router]);

  useEffect(() => {
    const valid =
      validateProductName(form.name) &&
      validateDescription(form.description) &&
      validatePrice(form.price) &&
      tagList.length > 0;
    setIsValid(valid);
  }, [form, tagList]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      const updated = { ...prev };
      const validators = {
        name: validateProductName,
        description: validateDescription,
        price: validatePrice,
        tags: validateTags,
      };

      if (!validators[field]?.(value)) {
        updated[field] = getErrorMessage(field);
      } else {
        delete updated[field];
      }
      return updated;
    });
  };

  const getErrorMessage = (field) => {
    const messages = {
      name: "상품명은 2자 이상 15자 이하로 입력해주세요.",
      description: "상품 소개는 10자 이상 100자 이하로 입력해주세요.",
      price: "가격은 0보다 커야 합니다.",
      tags: "태그는 1개 이상 입력해주세요.",
    };
    return messages[field];
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && form.tags.trim() && tagList.length < 5) {
      e.preventDefault();
      const newTag = form.tags.trim();
      if (!tagList.includes(newTag)) {
        setTagList((prev) => [...prev, newTag]);
        setForm((prev) => ({ ...prev, tags: "" }));
      }
    }
  };

  const handleTagDelete = (tag) => {
    setTagList((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentErrors = {};
    if (!validateProductName(form.name))
      currentErrors.name = getErrorMessage("name");
    if (!validateDescription(form.description))
      currentErrors.description = getErrorMessage("description");
    if (!validatePrice(form.price))
      currentErrors.price = getErrorMessage("price");
    if (tagList.length < 1) currentErrors.tags = getErrorMessage("tags");

    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요한 페이지입니다.");
      router.push("/signin");
      return;
    }

    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      tags: tagList,
      images: [],
    };

    const response = await createProduct(productData);

    if (response?.success) {
      router.push(`/products/${response.data.id}`);
    } else {
      console.error("상품 등록 실패", response?.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[344px] sm:w-[696px] md:w-300 mx-auto mt-6"
    >
      <div className="flex justify-between mb-6">
        <h3 className="text-[20px] font-bold text-gray-800">상품 등록하기</h3>
        <button
          type="submit"
          disabled={!isValid}
          className={`w-[74px] rounded-xl py-3 px-[23px] font-semibold text-base text-white ${
            isValid ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          등록
        </button>
      </div>

      {[
        {
          label: "상품명",
          field: "name",
          type: "text",
          placeholder: "상품명을 입력해주세요",
        },
        {
          label: "상품 소개",
          field: "description",
          type: "textarea",
          placeholder: "상품 소개를 입력해주세요",
        },
        {
          label: "판매가격",
          field: "price",
          type: "number",
          placeholder: "판매 가격을 입력해주세요",
        },
      ].map(({ label, field, type, placeholder }) => (
        <FormInput
          key={field}
          label={label}
          type={type}
          value={form[field]}
          onChange={handleChange(field)}
          placeholder={placeholder}
          error={errors[field]}
        />
      ))}

      {/* 태그 입력 */}
      <div className="mt-6">
        <label className="block font-bold text-[18px] text-secondary-800">
          태그
        </label>
        <input
          type="text"
          value={form.tags}
          onChange={handleChange("tags")}
          onKeyDown={handleKeyDown}
          placeholder="태그를 입력해주세요"
          disabled={tagList.length >= 5}
          className={`mt-4 w-full h-14 rounded-[12px] py-4 px-6 bg-gray-100 placeholder:text-secondary-400 ${
            errors.tags ? "border border-red-500" : ""
          }`}
        />
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
        )}

        {/* 태그 목록 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tagList.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-base text-secondary-800 bg-gray-100 rounded-full px-3 py-[6px]"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleTagDelete(tag)}
                className="ml-2 bg-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-white"
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
