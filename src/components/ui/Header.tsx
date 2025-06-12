"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type AppPath = "/articles" | "/products" | "/";

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: AppPath): boolean => pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="w-full flex items-center bg-white shadow-sm sticky top-0 z-10 h-[70px] px-4 sm:px-6 md:px-50">
      <div className="flex items-center gap-2 sm:gap-5 md:gap-6">
        <Link href="/" className="block">
          <div className="relative w-[81px] h-10 sm:w-[153px] sm:h-[51px]">
            <Image
              src="/img/logo.png"
              alt="로고"
              fill
              className=" hidden sm:block"
            />
            <Image
              src="/img/mobile_logo.png"
              alt="모바일 로고"
              fill
              className=" sm:hidden"
            />
          </div>
        </Link>

        <nav className="flex text-base sm:text-[18px] font-bold gap-2 sm:gap-5 md:gap-6">
          <Link
            href="/articles"
            className={`${
              isActive("/articles") ? "text-primary-100" : "text-secondary-600"
            }`}
          >
            자유게시판
          </Link>
          <Link
            href="/products"
            className={` ${
              isActive("/products") ? "text-primary-100" : "text-secondary-600"
            }`}
          >
            중고마켓
          </Link>
        </nav>
      </div>
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
              <span className="text-sm font-medium hidden sm:inline">
                {user.nickname}
              </span>
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
