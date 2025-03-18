import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./css/BoardCreateForm.css";

const BoardCreateForm = () => {
  return (
    <>
      <Header />
      <div className="boardForm">
        <form>
          <div className="boardHeader">
            <h2>게시글 쓰기</h2>
            <button type="submit" className="boardBtn">
              등록
            </button>
          </div>
          <div className="formGroup">
            <label className="boardTitle">*제목</label>
            <input
              className="boardTitleInput"
              placeholder="제목을 입력해주세요"
            ></input>
          </div>
          <div className="formGroup">
            <label className="boardDescription">*내용</label>
            <textarea
              className="boardDescriptionTextara"
              placeholder="내용을 입력해주세요"
            ></textarea>
          </div>
          <div className="formGroupImg">
            <label className="boardImg">이미지</label>
            <input type="file" className="boardImgInput"></input>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default BoardCreateForm;
