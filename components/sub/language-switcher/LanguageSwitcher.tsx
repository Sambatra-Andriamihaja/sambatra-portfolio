import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState, useTransition } from "react";

const LanguageSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localeActive = useLocale();

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(`/${nextLocale}`);
    });
  };

  return (
    <div className="relative inline-block">
      <select
        defaultValue={localeActive}
        onChange={handleLanguageChange}
        disabled={isPending}
        className="appearance-none bg-transparent border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-gray-300
        text-xs font-semibold"
      >
        <option value="en">🇺🇸 &nbsp; EN</option>
        <option value="fr">🇫🇷 &nbsp; FR</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 12l-6-6 1.41-1.41L10 9.17l4.59-4.58L16 6l-6 6z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
