import Image from "next/image";
import Link from "next/link";

export default function SnsSign() {
  const snsLinks = [
    {
      href: "https://www.google.com",
      src: "/img/google.png",
      alt: "Google 로그인",
    },
    {
      href: "https://www.kakaocorp.com/page",
      src: "/img/kakao.png",
      alt: "Kakao 로그인",
    },
  ];

  return (
    <div className="mt-6 py-4 px-6 bg-skyblue w-full h-[74px] rounded-[8px]">
      <div className="flex items-center justify-between h-full">
        <p className="text-base font-medium leading-[26px] text-gray-800">
          간편 로그인하기
        </p>
        <div className="flex gap-3">
          {snsLinks.map(({ href, src, alt }) => (
            <Link key={alt} href={href} passHref>
              <div className="relative w-[42px] h-[42px] cursor-pointer">
                <Image src={src} alt={alt} fill sizes="42px" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
