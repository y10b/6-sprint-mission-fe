"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { login as loginApi } from "@/features/auth/services/authApi";
import { validateEmail, validatePassword } from "@/utils/authValidation";
import Image from "next/image";
import Link from "next/link";
import SnsSign from "@/components/SnsSign";
import { useState } from "react";
import FormField from "@/components/Auth/AuthField"; // 새로 만든 컴포넌트

export default function Signin() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const result = await loginApi(data);
      await login(result);
      router.replace("/products");
    } catch (err) {
      setError("email", {
        type: "manual",
        message: err.message || "로그인 실패",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto sm:w-[640px] w-[343px] mt-20"
    >
      <div className="relative w-50 sm:w-99 h-[66px] sm:h-33 mx-auto mb-8">
        <Link href="/">
          <Image src="/img/logo.png" alt="logo" fill />
        </Link>
      </div>

      {/* 이메일 입력 */}
      <FormField
        id="email"
        label="이메일"
        type="email"
        placeholder="이메일을 입력해주세요"
        error={errors.email?.message}
        register={register("email", {
          required: "이메일을 입력해주세요.",
          validate: (value) =>
            validateEmail(value) || "잘못된 이메일 형식입니다.",
        })}
      />

      {/* 비밀번호 입력 */}
      <FormField
        id="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        toggleType
        show={showPassword}
        onToggle={() => setShowPassword((prev) => !prev)}
        error={errors.password?.message}
        register={register("password", {
          required: "비밀번호를 입력해주세요.",
          validate: (value) =>
            validatePassword(value) || "8자 이상 입력해주세요.",
        })}
      />

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={!isValid}
        className={`cursor-pointer mt-4 w-full h-14 rounded-[40px] font-semibold text-xl text-white ${
          isValid
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        로그인
      </button>

      <SnsSign />

      <div className="flex justify-center items-center mt-6 text-sm">
        <span className="text-gray-800">판다마켓이 처음이신가요?</span>
        <Link href="/signup" className="text-blue-500 underline ml-2">
          회원가입
        </Link>
      </div>
    </form>
  );
}
