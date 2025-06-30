"use client";

import Image from "next/image"; // Image 컴포넌트 import
import Banner from "@/components/ui/banner";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="w-full">
      {/* Banner Section */}

      <Banner
        imageUrl="/img/home_top.png"
        mobileText={{
          firstLine: "일상의 모든 물건을",
          secondLine: "거래해보세요",
        }}
        tabletText={{
          firstLine: "일상의 모든 물건을 거래해보세요",
        }}
        pcText={{
          firstLine: "일상의 모든 물건을",
          secondLine: "거래해 보세요",
        }}
        altText="배너 이미지"
        buttonText="구경하러 가기"
        onButtonClick={() => {
          router.push("/products");
        }}
      />

      {/* Content Sections */}
      <article className="max-w-[1200px] mx-auto mt-[52px] md:mt-[100px] mb-[52px] md:mb-[100px]">
        {/* First Section */}
        <div className="px-4 md:px-6 lg:px-[120px]">
          <section className="bg-[#fcfcfc] flex flex-col lg:flex-row lg:items-center lg:gap-[108px]">
            {/* Image - Left on PC */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-[calc(100%-32px)] md:w-[calc(100%-48px)] lg:w-[588px] mx-4 md:mx-6 lg:mx-0 aspect-[343/259] md:aspect-[696/444] lg:aspect-[588/444]">
                <Image
                  src="/img/Img_home_01.png"
                  alt="Hot item 이미지"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            {/* Text */}
            <div className="w-full lg:w-1/2 mt-4 md:mt-6 lg:mt-0 px-4 md:px-6">
              <p className="font-bold text-base sm:text-[18px] leading-[26px] text-primary-100">
                Hot item
              </p>
              <p className="mt-2 sm:mt-4 md:mt-3 font-bold text-2xl sm:text-[32px] md:text-[40px] leading-8 md:leading-[140%] text-secondary-700">
                인기 상품을 <br className="hidden md:block" /> 확인해보세요
              </p>
              <p className="mt-4 sm:mt-6 font-medium text-base sm:text-[18px] md:text-xl leading-[26px] md:leading-8 text-secondary-700">
                가장 HOT한 중고거래 물품을 <br className="hidden md:block" />{" "}
                판다 마켓에서 확인해 보세요
              </p>
            </div>
          </section>
        </div>

        {/* Second Section */}
        <div className="mt-[52px] md:mt-[100px] px-4 md:px-6 lg:px-[120px]">
          <section className="bg-[#fcfcfc] flex flex-col lg:flex-row lg:items-center lg:gap-[108px]">
            {/* Text - Left on PC */}
            <div className="w-full lg:w-1/2 mt-4 md:mt-6 lg:mt-0 px-4 md:px-6 order-2 lg:order-1 text-right">
              <p className="font-bold text-base sm:text-[18px] leading-[26px] text-primary-100 text-right">
                Search
              </p>
              <p className="mt-2 sm:mt-4 md:mt-3 font-bold text-2xl sm:text-[32px] md:text-[40px] leading-8 md:leading-[140%] text-secondary-700 text-right">
                구매를 원하는 <br className="hidden md:block" /> 상품을
                검색하세요
              </p>
              <p className="mt-4 sm:mt-6 font-medium text-base sm:text-[18px] md:text-xl leading-[26px] md:leading-8 text-secondary-700 text-right">
                구매하고 싶은 물품은 검색해서
                <br className="hidden md:block" /> 쉽게 찾아보세요
              </p>
            </div>
            {/* Image - Right on PC */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="relative w-[calc(100%-32px)] md:w-[calc(100%-48px)] lg:w-[588px] mx-4 md:mx-6 lg:mx-0 aspect-[343/259] md:aspect-[696/444] lg:aspect-[588/444]">
                <Image
                  src="/img/Img_home_02.png"
                  alt="Search 이미지"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Third Section */}
        <div className="mt-[52px] md:mt-[100px] px-4 md:px-6 lg:px-[120px]">
          <section className="bg-[#fcfcfc] flex flex-col lg:flex-row lg:items-center lg:gap-[108px]">
            {/* Image - Left on PC */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-[calc(100%-32px)] md:w-[calc(100%-48px)] lg:w-[588px] mx-4 md:mx-6 lg:mx-0 aspect-[343/259] md:aspect-[696/444] lg:aspect-[588/444]">
                <Image
                  src="/img/Img_home_03.png"
                  alt="Register 이미지"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            {/* Text */}
            <div className="w-full lg:w-1/2 mt-4 md:mt-6 lg:mt-0 px-4 md:px-6">
              <p className="font-bold text-base sm:text-[18px] leading-[26px] text-primary-100">
                Register
              </p>
              <p className="mt-2 sm:mt-4 md:mt-3 font-bold text-2xl sm:text-[32px] md:text-[40px] leading-8 md:leading-[140%] text-secondary-700">
                판매를 원하는 <br className="hidden md:block" /> 상품을
                등록하세요
              </p>
              <p className="mt-4 sm:mt-6 font-medium text-base sm:text-[18px] md:text-xl leading-[26px] md:leading-8 text-secondary-700">
                어떤 물건이든 판매하고 싶은 상품을
                <br className="hidden md:block" /> 쉽게 등록하세요
              </p>
            </div>
          </section>
        </div>
      </article>
      <Banner
        imageUrl="/img/home_bottom.png"
        mobileText={{
          firstLine: "믿을 수 있는",
          secondLine: "판다마켓 중고 거래",
        }}
        tabletText={{
          firstLine: "믿을 수 있는",
          secondLine: "판다마켓 중고 거래",
        }}
        pcText={{
          firstLine: "믿을 수 있는",
          secondLine: "판다마켓 중고 거래",
        }}
        altText="랜덤 배경 이미지"
      />
    </div>
  );
};

export default HomePage;
