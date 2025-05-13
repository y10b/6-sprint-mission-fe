"use client";

import Image from "next/image";
import { FaPlus } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";

export default function ImageUploader({
  image,
  handleImageChange,
  handleImageDelete,
  error,
}) {
  return (
    <div className="mt-6">
      <label className="block font-bold text-[18px] text-gray-800 mb-2">
        상품 이미지
      </label>
      {/* 슬라이더 스타일을 위한 가로 스크롤 컨테이너 */}
      <div className="flex gap-4 overflow-x-auto py-2 scroll-snap-x scroll-snap-mandatory scrollbar-hide">
        {/* 파일 업로드 버튼 */}
        {!image && (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center flex-shrink-0 w-40 h-40 rounded-xl cursor-pointer bg-secondary-100 hover:bg-gray-300 scroll-snap-start"
          >
            <div className="flex flex-col items-center justify-center">
              <FaPlus className="text-[28px] text-gray-400 mb-3" />
              <span className="font-normal text-base leading-[26px] text-gray-400">
                이미지 등록
              </span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}

        {/* 이미지 프리뷰 */}
        {image && (
          <div className="relative flex-shrink-0 w-40 h-40 scroll-snap-start">
            <Image
              src={image.url}
              alt="preview"
              fill
              className="object-cover rounded-xl"
              sizes="160px"
            />
            <button
              type="button"
              onClick={handleImageDelete}
              className="absolute top-2.5 right-2.5 cursor-pointer"
            >
              <TiDelete className="text-2xl text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 text-red-500 font-normal text-base leading-[26px]">
          *이미지는 1장만 등록 가능합니다.
        </p>
      )}
    </div>
  );
}
