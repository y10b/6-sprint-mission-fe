"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signup } from "@/features/auth/services/authApi";
import { useAuth } from "@/context/AuthContext";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/utils/authValidation";
import Image from "next/image";
import Link from "next/link";
import FormField from "@/components/Auth/AuthField";
import SnsSign from "@/components/SnsSign";
import Modal from "@/components/Auth/AuthModal";
import { useState } from "react";

export default function Signup() {
  const { login } = useAuth();
  const router = useRouter();
  const [errorModal, setErrorModal] = useState(false);
  const [show, setShow] = useState({
    password: false,
    passwordConfirmation: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data) => {
    try {
      await signup(data); // 서버가 쿠키로 토큰 설정
      await login(); // 사용자 정보만 가져와서 저장
      router.replace("/products");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "회원가입 실패";
      if (errorMessage.includes("이메일")) {
        setError("email", { type: "manual", message: errorMessage });
      } else {
        setErrorModal(true);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[343px] sm:w-160 mx-auto mt-6"
      >
        <div className="relative w-50 sm:w-99 h-[66px] sm:h-33 mx-auto mb-8">
          <Link href="/">
            <Image src="/img/logo.png" alt="logo" fill />
          </Link>
        </div>

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
          className={`cursor-pointer mt-4 w-full h-14 rounded-[40px] font-semibold text-xl text-white ${
            isValid
              ? "bg-blue-500 hover:bg-blue-600"
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
        <Modal
          message="회원가입에 실패했습니다. 다시 시도해주세요."
          onClose={() => setErrorModal(false)}
        />
      )}
    </>
  );
}
