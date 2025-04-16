"use client"; // 클라이언트 사이드 코드에서만 작동하도록 지정

import Image from "next/image"; // next/image 컴포넌트를 사용
import Link from "next/link"; // next/link로 라우팅
import { usePathname } from "next/navigation"; // 현재 경로를 가져오는 훅

export default function Header() {
  const pathname = usePathname(); // 현재 경로를 가져옴

  // 경로에 따라 active 클래스를 추가하는 로직
  const isActiveMarket = pathname === "/items";
  const isActiveArticle = pathname === "/articles";

  return (
    <header className="w-full flex items-center bg-white  shadow-sm sticky top-0 z-10 h-[4.375rem] px-8">
      <Link href="/" className="md:ml-[12.5rem] sm:ml-0">
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet="/img/mobile_logo.png"
            className="w-[60px] h-[40px]"
          />
          <img src="/img/logo.png" alt="로고" className="w-[150px] h-[60px]" />
        </picture>
      </Link>

      {/* 자유게시판 링크 */}
      <Link
        href="/articles"
        className={`sm:text-lg font-semibold  text-secondary-600 ${
          isActiveArticle ? "underline" : ""
        } sm:ml-3 md:ml-10`}
      >
        자유게시판
      </Link>

      {/* 중고마켓 링크 */}
      <Link
        href="/items"
        className={`sm:text-lg font-semibold leading-6 text-secondary-600 ${
          isActiveMarket ? "underline" : ""
        } ml-5`}
      >
        중고마켓
      </Link>

      {/* 로그인 버튼 */}
      <nav className="ml-auto">
        <Link href="/">
          <button className=" bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition">
            로그인
          </button>
        </Link>
      </nav>
    </header>
  );
}
