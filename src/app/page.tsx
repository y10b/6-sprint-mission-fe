"use client";

import Link from "next/link";
import Image from "next/image"; // Image 컴포넌트 import
import styles from "./HomePage.module.css"; // CSS module import

const HomePage = () => {
  return (
    <div>
      {/* Banner Section */}
      <article className={styles.banner}>
        <section className={styles.bannerInner}>
          <div className={styles.bannerText}>
            <p>
              일상의 모든 물건을 <br />
              거래해 보세요
            </p>
            <Link href="/products">
              <button type="button">구경하러 가기</button>
            </Link>
          </div>
          <div className={styles.bannerImg}>
            <Image
              src="/img/home_top.png"
              alt="배너 이미지"
              width={500}
              height={300}
              priority
            />
          </div>
        </section>
      </article>

      {/* Content Sections */}
      <article className={styles.contents}>
        {/* First Section */}
        <div className={styles.first}>
          <section>
            <div className={styles.firstImg}>
              <Image
                src="/img/Img_home_01.png"
                alt="Hot item 이미지"
                width={300}
                height={300}
              />
            </div>
            <div className={styles.firstText}>
              <p className={styles.pTitle}>Hot item</p>
              <p className={styles.pHighlight}>
                인기 상품을 <br />
                확인해 보세요
              </p>
              <p className={styles.pExplain}>
                가장 HOT한 중고거래 물품을 <br /> 판다 마켓에서 확인해 보세요
              </p>
            </div>
          </section>
        </div>

        {/* Second Section */}
        <div className={styles.second}>
          <section>
            <div className={styles.secondText}>
              <p className={styles.pTitle}>Search</p>
              <p className={styles.pHighlight}>
                구매를 원하는 <br />
                상품을 검색하세요
              </p>
              <p className={styles.pExplain}>
                구매하고 싶은 물품은 검색해서 <br /> 쉽게 찾아보세요
              </p>
            </div>
            <div className={styles.secondImg}>
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
        <div className={styles.third}>
          <section>
            <div className={styles.thirdImg}>
              <Image
                src="/img/Img_home_03.png"
                alt="Register 이미지"
                width={300}
                height={300}
              />
            </div>
            <div className={styles.thirdText}>
              <p className={styles.pTitle}>Register</p>
              <p className={styles.pHighlight}>
                판매를 원하는 <br /> 상품을 등록하세요
              </p>
              <p className={styles.pExplain}>
                어떤 물건이든 판매하고 싶은 상품을 <br /> 쉽게 등록하세요
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default HomePage;
