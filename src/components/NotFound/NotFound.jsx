import React from "react";
import { Link } from "react-router-dom"; // 홈으로 돌아가는 링크를 추가하기 위해 사용
import "./NotFount.css";

const NotFound = () => {
  return (
    <div className="NotFoundForm">
      <h1>404 - 페이지를 찾을 수 없습니다.</h1>
      <p>죄송합니다, 요청하신 페이지는 존재하지 않습니다.</p>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
};

export default NotFound;
