import React, { Dispatch, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { motion } from "framer-motion";

import styles from "./Cmd.module.css";
import terminalStyles from "@/components/projects/project-card/ProjectCard.module.css";
import useDarkMode from "@/hooks/useDarkMode";

interface ICmd {
  isDisabled: boolean;
  setInputText: Dispatch<SetStateAction<string>>;
}

const Cmd = (props: ICmd) => {
  const { isDisabled, setInputText } = props;

  const t = useTranslations("HomePage");

  const { isDarkMode } = useDarkMode();

  return (
    <div className={styles.cmd}>
      <div className="flex gap-3">
        <motion.p
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              x: "-100px",
              opacity: 0,
            },
            visible: {
              x: 0,
              opacity: 1,
              transition: {
                delay: 0.4,
                duration: 0.4,
              },
            },
          }}
        ></motion.p>
        <motion.p
          className="mb-2 text-sm"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              x: "100px",
              opacity: 0,
            },
            visible: {
              x: 0,
              opacity: 1,
              transition: {
                delay: 0.4,
                duration: 0.4,
              },
            },
          }}
        >
          {t('cmdSumUp')}
        </motion.p>
      </div>

      <div
        className={`h-14 text-sm text-white font-medium bg-black dark:bg-gradient-to-b dark:from-terminal dark:bg-transparent p-2`}
      >
        <div
          className={` ${
            isDarkMode ? `${terminalStyles.terminalPrompt}` : "flex ml-1"
          } `}
        >
          <span className="text-white dark:text-terminalUser">
            {"sambatra :"}
          </span>
          {!isDarkMode && <span>&nbsp;</span>}
          <span className="text-white dark:text-terminalLocation">
            {isDarkMode ? "~" : "\\"}
          </span>
          <span className="text-white">{isDarkMode ? "$" : ">"}</span>
          <motion.div className="flex items-center">
            <motion.span
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="ml-2"
            >
              <input
                disabled={isDisabled}
                type="text"
                placeholder="whois"
                onChange={(e) => setInputText(e.target.value)}
                className="bg-transparent border-none outline-none"
              />
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cmd;
