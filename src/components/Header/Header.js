import React from 'react';
import { useLocation, Link } from 'react-router-dom';  // Link 컴포넌트 추가
import './header.css';

function Header() {
    const location = useLocation(); // 현재 경로 가져오기

    // 경로가 '/items'일 때 "중고마켓" 버튼 색상을 변경하기 위한 조건
    const isActiveMarket = location.pathname === '/items';

    return (
        <header>
            <a className="header-logo" href="/">
                <img src="img/logo.png" alt="판다마켓_logo" className="responsive_logo" />
            </a>
            <a className='header-board' href='/'>자유게시판</a>

            <Link
                to='/items'
                className={`header-market ${isActiveMarket ? 'active' : ''}`}
            >
                중고마켓
            </Link>

            <nav>
                <button
                    className="header-button"
                    type="button"
                    onClick={() => (window.location.href = '/')}
                >
                    로그인
                </button>
            </nav>
        </header>
    );
}

export default Header;
