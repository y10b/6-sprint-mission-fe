"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/features/auth/services/authApi";
import { useAuth } from "@/context/AuthContext";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/utils/validation";
import Image from "next/image";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import SnsSign from "@/components/SnsSign";
import Modal from "@/components/AuthModal";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [show, setShow] = useState({
    password: false,
    passwordConfirmation: false,
  });

  const [errorModal, setErrorModal] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const { email, nickname, password, passwordConfirmation } = form;
  const isFormValid =
    email &&
    nickname &&
    password &&
    passwordConfirmation &&
    !errors.email &&
    !errors.password &&
    !errors.passwordConfirmation;

  useEffect(() => {
    setErrors({
      email: email && !validateEmail(email) ? "잘못된 이메일입니다." : "",
      password:
        password && !validatePassword(password) ? "8자 이상 입력해주세요" : "",
      passwordConfirmation:
        passwordConfirmation &&
        !validatePasswordMatch(password, passwordConfirmation)
          ? "비밀번호가 일치하지 않습니다"
          : "",
    });
  }, [email, password, passwordConfirmation]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleShowPassword = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const result = await signup(form);
      await login(result);
      router.replace("/products");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "회원가입 실패";
      if (errorMessage.includes("이메일")) {
        setErrors((prev) => ({ ...prev, email: errorMessage }));
      } else {
        setErrorModal(true);
      }
    }
  };

  const inputFields = [
    { label: "이메일", type: "email", field: "email", error: errors.email },
    { label: "닉네임", type: "text", field: "nickname" },
    {
      label: "비밀번호",
      type: show.password ? "text" : "password",
      field: "password",
      error: errors.password,
      showToggle: true,
      onToggle: () => toggleShowPassword("password"),
    },
    {
      label: "비밀번호 확인",
      type: show.passwordConfirmation ? "text" : "password",
      field: "passwordConfirmation",
      error: errors.passwordConfirmation,
      showToggle: true,
      onToggle: () => toggleShowPassword("passwordConfirmation"),
    },
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="w-[343px] sm:w-160 mx-auto mt-6">
        <div className="relative w-50 sm:w-99 h-[66px] sm:h-33 mx-auto mb-8">
          <Link href="/">
            <Image src="/img/logo.png" alt="logo" fill />
          </Link>
        </div>

        {inputFields.map(
          ({ label, type, field, error, showToggle, onToggle }, idx) => (
            <FormInput
              key={idx}
              label={label}
              type={type}
              value={form[field]}
              onChange={handleChange(field)}
              placeholder={`${label}을(를) 입력해주세요`}
              error={error}
              showToggle={showToggle}
              showPassword={undefined}
              onToggle={onToggle}
            />
          )
        )}

        <button
          type="submit"
          disabled={!isFormValid}
          className={`mt-4 w-full h-14 rounded-[40px] font-semibold text-xl leading-6 text-white ${
            isFormValid
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
