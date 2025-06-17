import React from "react";
import Image from "next/image";

type TextLines = {
  firstLine: string;
  secondLine?: string;
};

type BannerProps = {
  imageUrl: string;
  mobileText: TextLines;
  tabletText: TextLines;
  pcText: TextLines;
  altText?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

export default function Banner({
  imageUrl,
  mobileText,
  tabletText,
  pcText,
  altText = "배너 이미지",
  buttonText,
  onButtonClick,
}: BannerProps) {
  return (
    <div className="relative w-full h-[480px] bg-[#cfe5ff] flex flex-col items-center sm:h-[771px] md:h-[540px] md:flex-row md:items-end">
      <div className="w-full max-w-[240px]  mt-12 text-center sm:max-w-[512px] sm:mt-21 md:ml-[405px] md:mb-[100px] md:text-left">
        <h3 className="font-bold text-[32px] leading-[140%] text-secondary-900">
          {/* 모바일 버전 */}
          <div className="sm:hidden">
            <div>{mobileText.firstLine}</div>
            {mobileText.secondLine && <div>{mobileText.secondLine}</div>}
          </div>

          {/* 태블릿 버전 */}
          <div className="hidden sm:block md:hidden">
            <div>{tabletText.firstLine}</div>
            {tabletText.secondLine && <div>{tabletText.secondLine}</div>}
          </div>

          {/* PC 버전 */}
          <div className="hidden md:block ">
            <div>{pcText.firstLine}</div>
            {pcText.secondLine && <div>{pcText.secondLine}</div>}
          </div>
        </h3>
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="mt-[18px] w-[240px] h-12 bg-primary-100 text-secondary-50 py-3 rounded-[40px] font-bold text-[18px] leading-[26px]
            sm:mt-6 sm:w-[357px] sm:text-[20px] sm:leading-[28px]
            hover:bg-[#0056b3] transition-colors"
          >
            {buttonText}
          </button>
        )}
      </div>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[375px] h-[204px]
      sm:w-[744px] sm:h-[340px]
      md:static md:translate-x-0 md:mr-[202.5px] md:w-[746px] md:h-[340px] md:ml-auto"
      >
        <Image
          src={imageUrl}
          alt={altText}
          fill
          className="object-contain object-bottom"
          priority
        />
      </div>
    </div>
  );
}
