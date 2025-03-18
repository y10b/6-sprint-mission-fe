import React from "react";
import { useLocation, Link } from "react-router-dom"; // Link 컴포넌트 추가
import "./header.css";

function Header() {
  const location = useLocation(); // 현재 경로 가져오기

  /* 해당 경로에 표시 */
  const isActiveMarket = location.pathname === "/items";
  const isActiveBoard = location.pathname === "/BoardGeneral";

  return (
    <header>
      <Link to="/" className="headerLogo">
        <img
          src="img/logo.png"
          alt="판다마켓_logo"
          className="responsiveLogo"
        />
      </Link>
      <Link
        to="/BoardGeneral"
        className={`headerBoard ${isActiveBoard ? "active" : ""}`}
      >
        자유게시판
      </Link>
      <Link
        to="/items"
        className={`headerMarket ${isActiveMarket ? "active" : ""}`}
      >
        중고마켓
      </Link>

      <nav>
        <a href="/">
          <button className="headerButton" type="button">
            로그인
          </button>
        </a>
      </nav>
    </header>
  );
}

export default Header;
