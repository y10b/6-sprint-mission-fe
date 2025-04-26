"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/api/CUD/authApi";
import FormInput from "@/components/FormInput";
import SnsSign from "@/components/SnsSign";
import Modal from "@/components/AuthModal";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/utils/validation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function Signup() {
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordConfirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [show, setShow] = useState({
    password: false,
    passwordConfirmation: false,
  });
  const [errorModal, setErrorModal] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    const { email, nickname, password, passwordConfirmation } = form;
    const newErrors = {
      email: email && !validateEmail(email) ? "잘못된 이메일입니다." : "",
      password:
        password && !validatePassword(password) ? "8자 이상 입력해주세요" : "",
      passwordConfirmation:
        passwordConfirmation &&
        !validatePasswordMatch(password, passwordConfirmation)
          ? "비밀번호가 일치하지 않습니다"
          : "",
    };
    setErrors(newErrors);

    const isValid =
      email &&
      nickname &&
      password &&
      passwordConfirmation &&
      Object.values(newErrors).every((msg) => !msg);
    setIsFormValid(isValid);
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(form);

      await login(result);

      router.replace("/products");
    } catch (err) {
      console.error("회원가입 실패:", err.message);
      const errorMessage = err?.response?.data?.message || err.message;
      if (errorMessage.includes("이메일")) {
        setErrors((prev) => ({ ...prev, email: errorMessage }));
      } else {
        setErrorModal(true);
      }
    }
  };

  // 입력 필드 정의 배열
  const inputFields = [
    { label: "이메일", type: "email", field: "email", error: errors.email },
    { label: "닉네임", type: "text", field: "nickname" },
    {
      label: "비밀번호",
      type: "password",
      field: "password",
      error: errors.password,
      showToggle: true,
      showPassword: show.password,
      onToggle: () =>
        setShow((prev) => ({ ...prev, password: !prev.password })),
    },
    {
      label: "비밀번호 확인",
      type: "password",
      field: "passwordConfirmation",
      error: errors.passwordConfirmation,
      showToggle: true,
      showPassword: show.passwordConfirmation,
      onToggle: () =>
        setShow((prev) => ({
          ...prev,
          passwordConfirmation: !prev.passwordConfirmation,
        })),
    },
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="w-[343px] sm:w-160 mx-auto">
        <div className="relative w-50 sm:w-99 h-[66px] sm:h-33 mx-auto mt-6">
          <Image src="/img/logo.png" alt="logo" fill />
        </div>
        {inputFields.map(
          (
            { label, type, field, error, showToggle, showPassword, onToggle },
            idx
          ) => (
            <FormInput
              key={idx}
              label={label}
              type={type}
              value={form[field]}
              onChange={handleChange(field)}
              placeholder={`${label}을(를) 입력해주세요`}
              error={error}
              showToggle={showToggle}
              showPassword={showPassword}
              onToggle={onToggle}
            />
          )
        )}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`mt-4 w-full h-14 rounded-[40px] text-gray-100 font-semibold text-xl leading-6 ${
            isFormValid ? "bg-blue-500" : "bg-gray-400"
          }`}
        >
          회원가입
        </button>
        <SnsSign />
        <div className="flex justify-center items-center mt-6 gap-1 text-[14px]">
          <span className="text-gray-800 font-medium">이미 회원이신가요?</span>
          <Link href="/signin">
            <span className="text-blue-500 underline font-medium cursor-pointer">
              로그인
            </span>
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

export default Signup;
