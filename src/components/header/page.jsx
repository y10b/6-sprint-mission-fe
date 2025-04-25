"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // AuthContext에서 user와 setUser 가져오기

export default function Header() {
  const { user, setUser } = useAuth(); // AuthContext에서 user와 setUser 가져오기
  const pathname = usePathname();
  const router = useRouter();

  const isActiveMarket = pathname.startsWith("/products");
  const isActiveArticle = pathname.startsWith("/articles");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/"); // 클라이언트 사이드에서 router 사용
  };

  return (
    <header className="w-full flex items-center bg-white shadow-sm sticky top-0 z-10 h-[4.375rem] px-8">
      <Link href="/" className="ml-0">
        <div className="block sm:hidden w-[61px] h-[27px] relative">
          <Image src="/img/mobile_logo.png" alt="모바일 로고" fill />
        </div>
        <div className="hidden sm:block w-[153px] h-[51px] relative">
          <Image src="/img/logo.png" alt="로고" fill />
        </div>
      </Link>

      <Link
        href="/articles"
        className={`ml-2 text-base sm:text-lg font-semibold sm:ml-10 ${
          isActiveArticle ? "text-primary-100" : "text-secondary-600"
        }`}
      >
        자유게시판
      </Link>

      <Link
        href="/products"
        className={`ml-2 text-base sm:text-lg font-semibold sm:ml-10 ${
          isActiveMarket ? "text-primary-100" : "text-secondary-600"
        }`}
      >
        중고마켓
      </Link>

      <nav className="ml-auto flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={user.image || "/img/ic_profile.png"}
                alt="프로필 이미지"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span className="font-medium text-sm">{user.nickname}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-primary-100 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link href="/signin">
            <button className="bg-primary-100 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition cursor-pointer">
              로그인
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
}
