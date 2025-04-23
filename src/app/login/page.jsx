import Image from "next/image";
import Link from "next/link";
import React from "react";

function Login() {
  return (
    <>
      <div className="relative w-50 h-[66px] mt-20 mx-auto">
        <Link href="/">
          <Image src="/img/logo.png" alt="logo" fill></Image>
        </Link>
      </div>
      <form className="mx-auto w-[343px] h-[501px] mt-6">
        <label className="font-bold text-[14px] mb-2 leading-6 text-gray-800">
          이메일
        </label>
        <input className="w-full h-[56px] py-4 px-6 bg-gray-100 rounded-xl" />

        <label className="font-bold text-[14px] mb-2 leading-6 text-gray-800">
          비밀번호
        </label>
        <input
          type="password"
          className="w-full h-[56px] py-4 px-6 bg-gray-100 rounded-xl"
        />

        <button
          type="submit"
          className="mt-4 mx-auto bg-secondary-400 w-full h-14 rounded-[40px] cursor-pointer font-[600] text-xl leading-8 text-gray-100"
        >
          로그인
        </button>
        <div className="py-4 px-6 mt-6 bg-skyblue w-full h-[74px] rounded-[8px]">
          <div className="flex items-center justify-between h-full">
            <p className="font-[500] text-base leading-[26px] text-gray-800">
              간편 로그인하기
            </p>
            <div className="flex gap-3">
              <div className="relative w-[42px] h-[42px] cursor-pointer">
                <Image src="/img/google.png" alt="google" fill />
              </div>
              <div className="relative w-[42px] h-[42px] cursor-pointer">
                <Image src="/img/kakao.png" alt="kakao" fill />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="flex">
        <p>판다마켓이 처음이신가요?</p>
        <p>회원가입</p>
      </div>
    </>
  );
}

export default Login;
