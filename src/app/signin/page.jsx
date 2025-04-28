"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { login as loginApi } from "@/features/auth/services/authApi";
import FormInput from "@/components/FormInput";
import SnsSign from "@/components/SnsSign";
import { validateEmail, validatePassword } from "@/utils/validation";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const isFormValid = email && password && !errors.email && !errors.password;

  useEffect(() => {
    setErrors({
      email: email && !validateEmail(email) ? "잘못된 이메일 형식입니다." : "",
      password:
        password && !validatePassword(password) ? "8자 이상 입력해주세요." : "",
    });
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const result = await loginApi({ email, password });
      await login(result);
      router.replace("/products");
    } catch (err) {
      setErrors((prev) => ({ ...prev, email: err.message || "로그인 실패" }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto sm:w-[640px] w-[343px] mt-20"
    >
      <div className="relative w-[200px] h-[66px] mx-auto mb-8">
        <Link href="/">
          <Image src="/img/logo.png" alt="logo" fill />
        </Link>
      </div>

      <FormInput
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력해주세요"
        error={errors.email}
      />

      <FormInput
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력해주세요"
        showToggle
        showPassword={showPassword}
        onToggle={() => setShowPassword((prev) => !prev)}
        error={errors.password}
      />

      <button
        type="submit"
        disabled={!isFormValid}
        className={`mt-4 w-full h-14 rounded-[40px] font-semibold text-xl text-white ${
          isFormValid
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
