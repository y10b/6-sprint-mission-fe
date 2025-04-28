"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/features/products/services/productsApi";
import axios from "axios";

const BASE_URL = "https://panda-market-api.vercel.app";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    tags: [],
    images: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await getProductById(id);
        setProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          tags: data.tags,
          images: data.images,
        });
      } catch (err) {
        console.error("상품 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (field) => (e) => {
    const value =
      field === "tags"
        ? e.target.value.split(",").map((tag) => tag.trim())
        : field === "price"
        ? Number(e.target.value)
        : e.target.value;

    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      await axios.patch(`${BASE_URL}/products/${id}`, product, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("상품이 수정되었습니다!");
      router.push(`/products/${id}`);
    } catch (err) {
      console.error("상품 수정 실패:", err);
      alert("상품 수정에 실패했습니다.");
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold text-secondary-800">상품 수정</h1>
          <button
            type="submit"
            className="w-[74px] h-[42px] rounded-lg bg-gray-400 text-gray-100 font-semibold text-base"
          >
            등록
          </button>
        </div>

        {[
          { label: "*상품명", field: "name", type: "text" },
          { label: "*가격", field: "price", type: "number" },
          { label: "*설명", field: "description", type: "textarea" },
          { label: "태그 (쉼표로 구분)", field: "tags", type: "text" },
        ].map(({ label, field, type }) => (
          <div key={field} className="mb-4">
            <label className="text-lg font-bold text-secondary-800">
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                className="w-full h-[282px] resize-none py-4 px-6 my-3 bg-gray-100 rounded-xl text-secondary-400"
                value={product[field]}
                onChange={handleChange(field)}
              />
            ) : (
              <input
                type={type}
                className="w-full py-4 px-6 my-3 bg-gray-100 rounded-xl text-secondary-400"
                value={
                  field === "tags" ? product.tags.join(", ") : product[field]
                }
                onChange={handleChange(field)}
              />
            )}
          </div>
        ))}

        {/* 이미지 수정은 추후 추가 */}
      </form>
    </div>
  );
}
