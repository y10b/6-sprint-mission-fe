import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Search from "../Product/asset/Search";
import Filters from "../Product/asset/Filters";
import "./BoardGeneral.css";

const BoardGeneral = () => {
  return (
    <>
      <Header />
      <div className="BoardGeneralForm">
        <div className="bestPosts">
          <h1>베스트 게시글</h1>
        </div>
        <div className="postList">
          <div className="postheader">
            <h1>게시글</h1>
            <Link to="/boardCreate">
              <button>글쓰기</button>
            </Link>
          </div>
          <div className="postheader2">
            <Search />
            <Filters />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BoardGeneral;
