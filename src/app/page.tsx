"use client";

import Link from "next/link";
import Image from "next/image"; // Image 컴포넌트 import
import Banner from "@/components/ui/banner";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  return (
    <div>
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
      <article>
        {/* First Section */}
        <div>
          <section>
            <div>
              <Image
                src="/img/Img_home_01.png"
                alt="Hot item 이미지"
                width={300}
                height={300}
              />
            </div>
            <div>
              <p>Hot item</p>
              <p>
                인기 상품을 <br />
                확인해 보세요
              </p>
              <p>
                가장 HOT한 중고거래 물품을 <br /> 판다 마켓에서 확인해 보세요
              </p>
            </div>
          </section>
        </div>

        {/* Second Section */}
        <div>
          <section>
            <div>
              <p>Search</p>
              <p>
                구매를 원하는 <br />
                상품을 검색하세요
              </p>
              <p>
                구매하고 싶은 물품은 검색해서 <br /> 쉽게 찾아보세요
              </p>
            </div>
            <div>
              <Image
                src="/img/Img_home_02.png"
                alt="Search 이미지"
                width={300}
                height={300}
              />
            </div>
          </section>
        </div>

        {/* Third Section */}
        <div>
          <section>
            <div>
              <Image
                src="/img/Img_home_03.png"
                alt="Register 이미지"
                width={300}
                height={300}
              />
            </div>
            <div>
              <p>Register</p>
              <p>
                판매를 원하는 <br /> 상품을 등록하세요
              </p>
              <p>
                어떤 물건이든 판매하고 싶은 상품을 <br /> 쉽게 등록하세요
              </p>
            </div>
          </section>
        </div>
      </article>
      <Banner
        imageUrl="https://source.unsplash.com/random/1600x900"
        mobileText={{
          firstLine: "믿을 수 있는",
          secondLine: "판다마켓 중고 거래",
        }}
        tabletText={{
          firstLine: "믿을 수 있는",
          secondLine: "판다마켓 중고 거래",
        }}
        pcText={{
          firstLine: "일상의 모든 물건을",
          secondLine: "거래해 보세요",
        }}
        altText="랜덤 배경 이미지"
      />
    </div>
  );
};

export default HomePage;
