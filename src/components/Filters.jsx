"use client";

import React from "react";
import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

// 필터 옵션
const options = [
  { value: "recent", label: "최신 순" },
  { value: "favorite", label: "좋아요 순" },
];

const Filters = ({ orderBy, setOrderBy }) => {
  const selectedOption = options.find((option) => option.value === orderBy);

  return (
    <div className="w-[130px]">
      <Listbox value={orderBy} onChange={setOrderBy}>
        <div className="relative">
          {/* 선택된 옵션 보여주는 버튼 */}
          <Listbox.Button className="relative w-full h-[42px] rounded-xl border border-gray-200 bg-white text-gray-700 font-normal text-[16px] leading-[26px] pl-5 pr-10 text-left font-['Pretendard'] focus:outline-none transition-all duration-200">
            <span>{selectedOption?.label}</span>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          </Listbox.Button>

          {/* 옵션 리스트 */}
          <Listbox.Options className="absolute mt-2 w-full rounded-xl bg-white shadow-lg border border-gray-200 z-10 transition-all duration-200">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 rounded-xl ${
                    active ? "bg-gray-100" : ""
                  }`
                }
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default Filters;
