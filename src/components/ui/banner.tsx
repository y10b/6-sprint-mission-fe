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
    <div className="w-full h-135 sm:h-[771px] md:h-[540px] bg-[#cfe5ff] flex flex-col md:flex-row relative">
      <div className="flex justify-center w-full mt-12 sm:mt-21 md:w-[512px] md:self-end md:mb-[85px]">
        <div className="w-[240px] sm:w-[512px]">
          <h3 className="font-bold text-[32px] leading-[140%] text-center md:text-left break-words text-secondary-900">
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
            <div className="hidden md:block">
              <div>{pcText.firstLine}</div>
              {pcText.secondLine && <div>{pcText.secondLine}</div>}
            </div>
          </h3>
          {buttonText && (
            <button
              onClick={onButtonClick}
              className="mt-[18px] sm:mt-6 w-full sm:w-[357px] sm:mx-[77.5px] h-12 bg-primary-100 text-secondary-50 py-3 rounded-[40px] font-bold text-[18px] sm:text-[20px] leading-[26px] sm:leading-[28px]"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 md:relative md:self-end min-w-[375px] min-h-51 sm:min-w-186 sm:min-h-85 md:w-[746px] md:h-[340px]">
        <Image src={imageUrl} alt={altText} fill className="object-cover" />
      </div>
    </div>
  );
}
