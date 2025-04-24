import Image from "next/image";
import Link from "next/link";
import React from "react";

function SnsSign() {
  return (
    <div className="py-4 px-6 mt-6 bg-skyblue w-full h-[74px] rounded-[8px]">
      <div className="flex items-center justify-between h-full">
        <p className="font-[500] text-base leading-[26px] text-gray-800">
          간편 로그인하기
        </p>
        <div className="flex gap-3">
          <Link href="https://www.google.com">
            <div className="relative w-[42px] h-[42px] cursor-pointer">
              <Image src="/img/google.png" alt="google" fill />
            </div>
          </Link>
          <Link href="https://www.kakaocorp.com/page">
            <div className="relative w-[42px] h-[42px] cursor-pointer">
              <Image src="/img/kakao.png" alt="kakao" fill />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SnsSign;
