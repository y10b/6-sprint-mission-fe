"use client";

import { useMemo } from "react";
import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

type OrderByValue = "latest" | "likes";

interface OrderOption {
  value: OrderByValue;
  label: string;
}

interface FiltersProps {
  orderBy: OrderByValue;
  setOrderBy: (value: OrderByValue) => void;
}

const options: readonly OrderOption[] = [
  { value: "latest", label: "최신 순" },
  { value: "likes", label: "좋아요 순" },
] as const;

export default function Filters({ orderBy, setOrderBy }: FiltersProps) {
  const selectedOption = useMemo(
    () => options.find((option) => option.value === orderBy),
    [orderBy]
  );

  return (
    <div className="w-[130px]">
      <Listbox value={orderBy} onChange={setOrderBy}>
        <div className="relative">
          <Listbox.Button className="relative w-full h-[42px] pl-5 pr-10 text-left text-[16px] leading-[26px] text-gray-700 font-normal font-['Pretendard'] bg-white border border-gray-200 rounded-xl focus:outline-none transition">
            <span>{selectedOption ? selectedOption.label : "정렬"}</span>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          </Listbox.Button>

          <Listbox.Options className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            {options.map(({ value, label }) => (
              <Listbox.Option
                key={value}
                value={value}
                className={({ active }: { active: boolean }) =>
                  `cursor-pointer select-none px-4 py-2 rounded-xl ${
                    active ? "bg-gray-100" : ""
                  }`
                }
              >
                {label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
