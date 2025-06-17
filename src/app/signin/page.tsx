"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { login as loginApi } from "@/lib/api/auth/auth.api";
import { getValidationError } from "@/utils/authValidation";
import Image from "next/image";
import Link from "next/link";
import SnsSign from "@/components/SnsSign";
import { useState } from "react";
import FormField from "@/components/Auth/AuthField";
import Modal from "@/components/Auth/AuthModal";
import { AxiosError } from "axios";

interface SigninFormData {
  email: string;
  password: string;
}

interface ApiErrorResponse {
  success: boolean;
  error: string;
  message?: string;
}

export default function Signin() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<SigninFormData>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<SigninFormData> = async (data) => {
    try {
      const result = await loginApi(data);

      if (result.user) {
        await login(result.user);
        router.replace("/products");
      } else {
        const message = "로그인에 실패했습니다. 다시 시도해주세요.";
        setError("email", {
          type: "manual",
          message,
        });
        setErrorMessage(message);
        setErrorModal(true);
      }
    } catch (err) {
      console.error("Login Error:", err);
      let errorMessage: string;

      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const error = err as AxiosError<ApiErrorResponse>;
        errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "이메일 또는 비밀번호가 일치하지 않습니다.";
      }

      // 이메일/비밀번호 오류는 이메일 필드에 표시
      if (
        errorMessage.includes("이메일") ||
        errorMessage.includes("비밀번호")
      ) {
        setError("email", {
          type: "manual",
          message: errorMessage,
        });
      }

      setErrorMessage(errorMessage);
      setErrorModal(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto sm:w-[640px] w-[343px] mt-20 sm:mt-[190px] md:mt-[227px] mb-[231px] sm:mb-[325px] md:mb-71"
      >
        {/* vercel 이미지 컴포넌트 아끼기 위해 이미지 태그 사용 */}
        <Link href="/">
          <img
            src="/img/logo.png"
            alt="logo"
            className="w-50 sm:w-99 h-[66px] sm:h-33 mx-auto mb-8"
          />
        </Link>

        {/* 이메일 입력 */}
        <FormField
          id="email"
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          error={errors.email?.message}
          register={register("email", {
            validate: getValidationError.email,
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
            validate: getValidationError.password,
          })}
        />

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={!isValid}
          className={`mt-4 w-full h-14 rounded-[40px] font-semibold text-xl text-white ${
            isValid
              ? "bg-primary-100 hover:bg-primary-200 cursor-pointer "
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

      {errorModal && (
        <Modal message={errorMessage} onClose={() => setErrorModal(false)} />
      )}
    </>
  );
}
