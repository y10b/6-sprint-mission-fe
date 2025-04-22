"use client"; // Client Component로 지정

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // App Router에서 사용하는 useRouter
import Link from "next/link";

const NotFound = () => {
    const router = useRouter();

    useEffect(() => {
        // 3초 후 자동으로 루트 페이지로 이동
        const timer = setTimeout(() => {
            router.push("/"); // 루트 페이지로 이동
        }, 3000);

        // 컴포넌트가 unmount될 때 타이머를 정리
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-red-600">404</h1>
            <p className="text-xl mt-1.5 text-gray-700 ">페이지를 찾을 수 없습니다. </p>
            <p className="text-xl text-gray-700 mb-6">3초 뒤 페이지 이동합니다. </p>
            <Link
                href="/"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
};

export default NotFound;
