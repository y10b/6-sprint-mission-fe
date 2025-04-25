"use client";

import { useState, useEffect } from "react";
import { getProductById } from "@/actions/products";
import Image from "next/image";
import { useParams } from "next/navigation";
import Dropdown from "@/components/DropDown";
import { formatNumber } from "@/components/utils";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("상품을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>상품 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="w-[343px] p-4 max-w-4xl mx-auto">
      <div className="mx-auto">
        {product.images.length > 0 ? (
          product.images.map((image, index) => (
            <div key={index} className="relative  h-[343px] mx-auto mb-4">
              <Image
                src={image}
                alt={product.name}
                fill
                className="mb-4 rounded-xl"
              />
            </div>
          ))
        ) : (
          <div className="relative  h-[343px] mx-auto mb-4">
            <Image src="/img/making.png" alt={product.name} fill />
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <span className="text-base font-semibold leading-[26px] mb-2 text-secondary-800">
          {product.name}
        </span>
        <Dropdown></Dropdown>
      </div>
      <p className="text-2xl font-semibold leading-8 mb-4 text-secondary-800">
        {formatNumber(product.price)}원
      </p>
      <hr className=" text-gray-200 mb-4" />
      <span className="font-semibold text-[14px] leading-6 text-secondary-800 mb-2">
        상품 소개
      </span>
      <p className="font-[400] text-base leading-[26px] text-secondary-800 mb-6">
        {product.description}
      </p>

      <span className="font-semibold text-[14px] leading-6 text-secondary-800">
        상품 태그
      </span>
      <div className="flex flex-wrap gap-2 mt-2">
        {product.tags.map((tag, index) => (
          <span
            key={index}
            className="px-4 py-[5px] bg-gray-100 text-base font-[400] leading-[26px] text-gray-800 rounded-[26px] h-9 text-center"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-2 flex">
          <p className="font-medium">{product.ownerNickname}</p>
          <p className="text-sm text-gray-500">
            {new Date(product.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <p className="text-lg mb-2">{product.favoriteCount}</p>
        <hr className="my-6" />
        <span className="font-semibold text-base leading-[26px] text-secondary-800 mb-4">
          문의하기
        </span>
        <textarea
          className="w-full h-[129px] py-4 px-6 mt-4 resize-none font-normal text-[14px] leading-6 text-gray-800 placeholder:text-secondary-400 bg-gray-100 rounded-lg p-2"
          placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
        ></textarea>
      </div>
      <button className="w-[74px] h-[42px] bg-gray-400 rounded-xl font-semibold text-base leading-[26px] text-gray-100 ">
        등록
      </button>
    </div>
  );
};

export default ProductPage;
