import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div>
        <article className="banner">
          <section className="bannerInner">
            <div className="bannerText">
              <p>
                일상의 모든 물건을 <br />
                거래해 보세요
              </p>
              <Link to="/items">
                <button type="button">구경하러 가기</button>
              </Link>
            </div>
            <div className="bannerImg">
              <img src="/img/home_top.png" alt="배너 이미지" />
            </div>
          </section>
        </article>

        {/* 콘텐츠 섹션 */}
        <article className="contents">
          {/* 첫 번째 섹션 */}
          <div className="first">
            <section>
              <div className="firstImg">
                <img src="/img/Img_home_01.png" alt="Hot item 이미지" />
              </div>
              <div className="firstText">
                <p className="pTitle">Hot item</p>
                <p className="pHighlight">
                  인기 상품을 <br />
                  확인해 보세요
                </p>
                <p className="pExplain">
                  가장 HOT한 중고거래 물품을 <br /> 판다 마켓에서 확인해 보세요
                </p>
              </div>
            </section>
          </div>

          {/* 두 번째 섹션 */}
          <div className="second">
            <section>
              <div className="secondText">
                <p className="pTitle">Search</p>
                <p className="pHighlight">
                  구매를 원하는 <br />
                  상품을 검색하세요
                </p>
                <p className="pExplain">
                  구매하고 싶은 물품은 검색해서 <br /> 쉽게 찾아보세요
                </p>
              </div>
              <div className="secondImg">
                <img src="/img/Img_home_02.png" alt="Search 이미지" />
              </div>
            </section>
          </div>

          {/* 세 번째 섹션 */}
          <div className="third">
            <section>
              <div className="thirdImg">
                <img src="/img/Img_home_03.png" alt="Register 이미지" />
              </div>
              <div className="thirdText">
                <p className="pTitle">Register</p>
                <p className="pHighlight">
                  판매를 원하는 <br /> 상품을 등록하세요
                </p>
                <p className="pExplain">
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
