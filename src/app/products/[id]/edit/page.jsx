"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/actions/products";
import axios from "axios";

const BASE_URL = "https://panda-market-api.vercel.app";

export default function EditProductPage() {
  const { id } = useParams(); // URL에서 id 추출
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setTags(data.tags);
        setImages(data.images);
      } catch (err) {
        console.error("상품 불러오기 실패:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken"); // 토큰 가져오기

    try {
      await axios.patch(
        `${BASE_URL}/products/${id}`,
        {
          name,
          description,
          price,
          tags,
          images,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 요기 추가
          },
        }
      );

      alert("상품이 수정되었습니다!");
      router.push(`/products/${id}`);
    } catch (err) {
      console.error("상품 수정 실패:", err);
      alert("상품 수정에 실패했습니다.");
    }
  };

  if (!product) return <p>로딩 중...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold text-secondary-800">상품 수정</h1>
          <button
            type="submit"
            className="w-[74px] h-[42px] rounded-[8px] bg-gray-400 text-gray-100 font-[600] text-base"
          >
            등록
          </button>
        </div>

        <label className="text-[18px] font-bold text-secondary-800">
          *상품명
        </label>
        <input
          className="w-full py-4 px-6 my-3 bg-gray-100 rounded-xl text-secondary-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="text-[18px] font-bold text-secondary-800">
          *가격
        </label>
        <input
          type="number"
          className="w-full py-4 px-6 my-3 bg-gray-100 rounded-xl text-secondary-400"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <label className="text-[18px] font-bold text-secondary-800">
          *설명
        </label>
        <textarea
          className="w-full h-[282px] resize-none py-4 px-6 my-3 bg-gray-100 rounded-xl text-secondary-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="text-[18px] font-bold text-secondary-800">
          태그 (쉼표로 구분)
        </label>
        <input
          className="w-full py-4 px-6 my-3 bg-gray-100 rounded-xl text-secondary-400"
          value={tags.join(", ")}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((tag) => tag.trim()))
          }
        />

        {/* 이미지 수정은 나중에 추가 가능 */}
      </form>
    </div>
  );
}
