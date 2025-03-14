import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import "./style.css"; // 메인 스타일 시트
import Header from "../Header/Header.js";
import Footer from "../Footer/Footer.js";
const HomePage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <>
      <Header />
      <div>
        <article className="banner">
          <section className="banner_inner">
            <div className="banner_text">
              <p>
                일상의 모든 물건을 <br />
                거래해 보세요
              </p>
              <button type="button" onClick={() => navigate("/items")}>
                구경하러 가기
              </button>{" "}
              {/* 버튼 클릭 시 /items로 이동 */}
            </div>
            <div className="banner_img">
              <img src="/img/home_top.png" alt="배너 이미지" />
            </div>
          </section>
        </article>

        {/* 콘텐츠 섹션 */}
        <article className="contents">
          {/* 첫 번째 섹션 */}
          <div className="first">
            <section>
              <div className="first_img">
                <img src="/img/Img_home_01.png" alt="Hot item 이미지" />
              </div>
              <div className="first_text">
                <p className="p_title">Hot item</p>
                <p className="p_highlight">
                  인기 상품을 <br />
                  확인해 보세요
                </p>
                <p className="p_explain">
                  가장 HOT한 중고거래 물품을 <br /> 판다 마켓에서 확인해 보세요
                </p>
              </div>
            </section>
          </div>

          {/* 두 번째 섹션 */}
          <div className="second">
            <section>
              <div className="second_text">
                <p className="p_title">Search</p>
                <p className="p_highlight">
                  구매를 원하는 <br />
                  상품을 검색하세요
                </p>
                <p className="p_explain">
                  구매하고 싶은 물품은 검색해서 <br /> 쉽게 찾아보세요
                </p>
              </div>
              <div className="second_img">
                <img src="/img/Img_home_02.png" alt="Search 이미지" />
              </div>
            </section>
          </div>

          {/* 세 번째 섹션 */}
          <div className="third">
            <section>
              <div className="third_img">
                <img src="/img/Img_home_03.png" alt="Register 이미지" />
              </div>
              <div className="third_text">
                <p className="p_title">Register</p>
                <p className="p_highlight">
                  판매를 원하는 <br /> 상품을 등록하세요
                </p>
                <p className="p_explain">
                  어떤 물건이든 판매하고 싶은 상품을 <br /> 쉽게 등록하세요
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
