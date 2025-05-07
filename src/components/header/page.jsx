"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="w-full flex items-center bg-white shadow-sm sticky top-0 z-10 h-[70px] px-8">
      <Link href="/" className="block">
        <div className="relative w-[61px] h-[27px] sm:w-[153px] sm:h-[51px]">
          <Image
            src={
              pathname.startsWith("/products") ||
              pathname.startsWith("/articles")
                ? "/img/mobile_logo.png"
                : "/img/logo.png"
            }
            alt="로고"
            fill
            className="object-contain"
          />
        </div>
      </Link>

      <nav className="flex ml-2 sm:ml-10 gap-4 sm:gap-10">
        <Link
          href="/articles"
          className={`text-base sm:text-lg font-semibold ${
            isActive("/articles") ? "text-primary-100" : "text-secondary-600"
          }`}
        >
          자유게시판
        </Link>
        <Link
          href="/products"
          className={`text-base sm:text-lg font-semibold ${
            isActive("/products") ? "text-primary-100" : "text-secondary-600"
          }`}
        >
          중고마켓
        </Link>
      </nav>

      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <Image
                src={user.image || "/img/ic_profile.png"}
                alt="프로필"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span className="text-sm font-medium">{user.nickname}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-primary-100 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            href="/signin"
            className="bg-primary-100 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
