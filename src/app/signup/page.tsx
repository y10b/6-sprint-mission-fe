"use client";

import { useForm, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api/auth/auth.api";
import { login as loginApi } from "@/lib/api/auth/auth.api";
import { useAuth } from "@/context/AuthContext";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/utils/authValidation";
import Link from "next/link";
import FormField from "@/components/Auth/AuthFormField";
import SnsSign from "@/components/SnsSign";
import Modal from "@/components/Auth/AuthModal";
import { useState } from "react";
import { AxiosError } from "axios";
import {
  ApiErrorResponse,
  ShowPasswordState,
  SignupFormData,
} from "@/types/auth";

export default function Signup() {
  const { login } = useAuth();
  const router = useRouter();
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [show, setShow] = useState<ShowPasswordState>({
    password: false,
    passwordConfirmation: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const toggleShow = (field: keyof ShowPasswordState): void => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    try {
      await signup(data);
      const loginResponse = await loginApi({
        email: data.email,
        password: data.password,
      });
      login(loginResponse.user);
      router.replace("/products");
    } catch (err) {
      console.error("Signup error:", err);
      let errorMessage: string;

      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const error = err as AxiosError<ApiErrorResponse>;
        errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "회원가입에 실패했습니다. 다시 시도해주세요.";
      }

      if (errorMessage.includes("이메일")) {
        setError("email", { type: "manual", message: errorMessage });
      } else if (errorMessage.includes("닉네임")) {
        setError("nickname", { type: "manual", message: errorMessage });
      }

      setErrorMessage(errorMessage);
      setErrorModal(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[343px] sm:w-160 mx-auto mt-6 sm:mt-12 md:mt-15 mb-[179px] sm:mb-[243px] md:mb-[178px] "
      >
        {/* vercel 이미지 컴포넌트 아끼기 위해 이미지 태그 사용 */}
        <Link href="/">
          <img
            src="/img/logo.png"
            alt="logo"
            className="w-50 sm:w-99 h-[66px] sm:h-33 mx-auto mb-8"
          />
        </Link>

        <FormField
          label="이메일"
          id="email"
          type="email"
          placeholder="이메일을 입력해주세요"
          error={errors.email?.message}
          register={register("email", {
            required: "이메일을 입력해주세요.",
            validate: (value) => validateEmail(value) || "잘못된 이메일입니다.",
          })}
        />

        <FormField
          label="닉네임"
          id="nickname"
          type="text"
          placeholder="닉네임을 입력해주세요"
          error={errors.nickname?.message}
          register={register("nickname", {
            required: "닉네임을 입력해주세요.",
          })}
        />

        <FormField
          label="비밀번호"
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          error={errors.password?.message}
          toggleType
          onToggle={() => toggleShow("password")}
          show={show.password}
          register={register("password", {
            required: "비밀번호를 입력해주세요.",
            validate: (value) =>
              validatePassword(value) || "8자 이상 입력해주세요",
          })}
        />

        <FormField
          label="비밀번호 확인"
          id="passwordConfirmation"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          error={errors.passwordConfirmation?.message}
          toggleType
          onToggle={() => toggleShow("passwordConfirmation")}
          show={show.passwordConfirmation}
          register={register("passwordConfirmation", {
            required: "비밀번호를 확인해주세요.",
            validate: (value) =>
              validatePasswordMatch(value, watch("password")) ||
              "비밀번호가 일치하지 않습니다",
          })}
        />

        <button
          type="submit"
          disabled={!isValid}
          className={`mt-4 w-full h-14 rounded-[40px] font-semibold text-xl text-white ${
            isValid
              ? "bg-primary-100 hover:bg-primary-200 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          회원가입
        </button>

        <SnsSign />

        <div className="flex justify-center items-center mt-6 text-sm">
          <span className="text-gray-800">이미 회원이신가요?</span>
          <Link href="/signin" className="text-blue-500 underline ml-2">
            로그인
          </Link>
        </div>
      </form>

      {errorModal && (
        <Modal message={errorMessage} onClose={() => setErrorModal(false)} />
      )}
    </>
  );
}
