"use client"; // 클라이언트 사이드 코드에서만 작동하도록 지정

import Link from "next/link"; // next/link로 라우팅

export default function Footer() {
  return (
    <footer className="overflow-x-hidden overflow-y-auto mt-[100px]">
      <article className="foot">
        {/* Footer Decoration */}
        <div className="footerDecoration bg-gray-200 h-12 mt-7"></div>

        {/* Footer License Section */}
        <section className="footerLicense flex  gap-3 items-start bg-secondary-900 justify-between pt-8 font-pretendard h-40">
          {/* Copy Section */}
          <div className="copy flex items-center md:ml-[12.5rem]">
            <p className="text-secondary-400 font-normal leading-6 whitespace-nowrap">
              &copy;codeit - 2024
            </p>
          </div>

          {/* Privacy Policy and FAQ Links */}
          <div className="flex gap-7">
            <Link
              href="404/board/index.html"
              className="text-secondary-200 font-normal hover:opacity-50"
            >
              Privacy Policy
            </Link>
            <Link
              href="404/market/index.html"
              className="text-secondary-200 font-normal hover:opacity-50"
            >
              FAQ
            </Link>
          </div>

          {/* Social Media Icons */}
          <section className="sns flex gap-3 md:mr-[12.5rem] sm:mr-0">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="../img/ic_facebook.png"
                alt="Facebook"
                className="h-6 w-6 cursor-pointer hover:opacity-50 hover:scale-105 transition-all"
              />
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
              <img
                src="../img/ic_twitter.png"
                alt="Twitter"
                className="h-6 w-6 cursor-pointer hover:opacity-50 hover:scale-105 transition-all"
              />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="../img/ic_youtube.png"
                alt="YouTube"
                className="h-6 w-6 cursor-pointer hover:opacity-50 hover:scale-105 transition-all"
              />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="../img/ic_instagram.png"
                alt="Instagram"
                className="h-6 w-6 cursor-pointer hover:opacity-50 hover:scale-105 transition-all"
              />
            </a>
          </section>
        </section>
      </article>
    </footer>
  );
}
