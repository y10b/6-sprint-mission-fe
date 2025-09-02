import React from "react";
import { FiX } from "react-icons/fi";

interface IProps {
  images: { file: File; url: string }[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageDelete: (index: number) => void;
  error?: string;
}

const ImageUploader = ({
  images,
  handleImageChange,
  handleImageDelete,
  error,
}: IProps) => {
  return (
    <div className="mb-6">
      <label className="block text-base font-semibold text-gray-800 mb-2">
        상품 이미지
      </label>
      <div
        className={`min-h-[200px] p-6 rounded-xl bg-gray-100 border ${
          error ? "border-red-500" : "border-transparent"
        } focus-within:border-blue-500`}
      >
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-[140px] h-[140px] rounded-lg overflow-hidden"
            >
              <img
                src={image.url}
                alt={`상품 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleImageDelete(index)}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
          {images.length < 3 && (
            <label className="flex items-center justify-center w-[140px] h-[140px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-gray-500">+ 이미지 추가</span>
            </label>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm font-semibold text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
