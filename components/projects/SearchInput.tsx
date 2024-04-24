"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { KW } from "@/constants/projects";

interface ISearchInput {
  keyWords: string | undefined;
  search: () => void;
}

export const SearchInput = (props: ISearchInput) => {
  const { keyWords, search } = props;

  const router = useRouter();
  const pathname = usePathname();

  const [inputValue, setInputValue] = useState<string | undefined>(keyWords);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setInputValue(inputValue);
  };

  const handleSearch = () => {
    if (inputValue) return router.push(`${pathname}/?${KW}=${inputValue}`);

    if (!inputValue) return router.push(pathname);
  };

  const handleKeyPress = (event: { key: any }) => {
    if (event.key === "Enter") return handleSearch();
  };

  const resetInputValue = () => setInputValue("");

  useEffect(() => {
    if (!keyWords) resetInputValue();
    search();
  }, [keyWords]);

  return (
    <section
      id="project-search"
      className="w-full items-center justify-center hidden sm:flex"
    >
      <div className="search__input w-[30rem] border border-solid border-dark dark:border-light flex flex-row items-center gap-5 p-1 rounded-[15px] mb-3">
        <FontAwesomeIcon
          icon={faSearch}
          className="m-2 text-dark dark:text-light cursor-pointer"
          onClick={() => handleSearch()}
        />

        <input
          type="text"
          id="inputId"
          placeholder="Enter your keywords"
          value={inputValue ?? ""}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          className="bg-[transparent] outline-none border-none w-full py-3 pl-2 pr-3"
        />
      </div>
    </section>
  );
};
