"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import SnsSign from "@/components/SnsSign";
import { validateEmail, validatePassword } from "@/utils/validation";
import { login as loginApi } from "@/app/api/CUD/productApi"; // 로그인 API
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // ✅ 추가된 부분

function Signin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login } = useAuth(); // ✅ 컨텍스트에서 로그인 함수 사용

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    const { email, password } = form;

    const newErrors = {
      email: email && !validateEmail(email) ? "잘못된 이메일 형식입니다." : "",
      password:
        password && !validatePassword(password) ? "8자 이상 입력해주세요." : "",
    };

    setErrors(newErrors);

    const isValid =
      email && password && Object.values(newErrors).every((e) => !e);

    setIsFormValid(isValid);
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      // ✅ 1. 로그인 API 호출
      const result = await loginApi(form); // accessToken, refreshToken만 포함되어 있음

      // ✅ 2. 전역 상태 및 유저정보 세팅
      await login(result); // 내부에서 getCurrentUser() 호출 후 setUser()

      // ✅ 3. 리다이렉트
      router.replace("/products");
    } catch (err) {
      console.error("로그인 실패:", err.message);
      setErrors((prev) => ({ ...prev, email: err.message || "로그인 실패" }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto sm:w-[640px] w-[343px] h-[501px] mt-20"
    >
      <div className="relative sm:w-100 sm:h-33 w-50 h-[66px] mx-auto">
        <Link href="/">
          <Image src="/img/logo.png" alt="logo" fill />
        </Link>
      </div>

      <FormInput
        label="이메일"
        type="email"
        value={form.email}
        onChange={handleChange("email")}
        placeholder="이메일을 입력해주세요"
        error={errors.email}
      />

      <FormInput
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange("password")}
        placeholder="비밀번호를 입력해주세요"
        showToggle={true}
        showPassword={showPassword}
        onToggle={() => setShowPassword((prev) => !prev)}
        error={errors.password}
      />

      <button
        type="submit"
        disabled={!isFormValid}
        className={`mt-4 mx-auto w-full h-14 rounded-[40px] font-[600] text-xl leading-8 text-gray-100 ${
          isFormValid
            ? "bg-blue-500 cursor-pointer hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        로그인
      </button>

      <SnsSign />

      <div className="flex justify-center items-center mt-6 gap-1 text-[14px]">
        <span className="text-gray-800 font-medium">
          판다마켓이 처음이신가요?
        </span>
        <Link href="/signup">
          <span className="text-blue-500 underline font-medium cursor-pointer">
            회원가입
          </span>
        </Link>
      </div>
    </form>
  );
}

export default Signin;
