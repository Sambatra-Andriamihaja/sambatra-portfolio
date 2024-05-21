import React from "react";
import { motion } from "framer-motion";
import style from "./WhoIs.module.css";

const WhoIs = () => {
  return (
    <div
      className={`${style.container} bg-white text-black dark:bg-[#1E1E1E] dark:text-white `}
    >
      <div
        className="flex relative ml-[5%] overflow-hidden h-auto"
        style={{ fontSize: "10px" }}
      >
        <motion.div
          className="flex flex-col text-base"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
              transition: {
                type: "spring",
                delay: 0.2,
                duration: 2,
              },
            },
          }}
        >
          <div className={style.vertical_line}></div>
        </motion.div>
        <motion.div
          className={style.content}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              y: "300px",
              opacity: 0,
            },
            visible: {
              y: "0px",
              opacity: 1,
              transition: {
                type: "spring",
                delay: 0.2,
                duration: 3,
              },
            },
          }}
        >
          <pre className="whitespace-pre-wrap ">
            <span className="text-blue-800 dark:text-blue-400 -ml-4">
              {"{"}
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="text-purple-700 dark:text-purple-400">
              &quot;name&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">:</span>{" "}
            <span className="text-green-600 dark:text-green-400">
              &quot;Sambatra Andriamihaja&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;
            <span className="text-purple-700 dark:text-purple-400">
              &quot;located_in&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">:</span>{" "}
            <span className="text-green-600 dark:text-green-400">
              &quot;Antananarivo, Madagascar&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;
            <span className="text-purple-700 dark:text-purple-400">
              &quot;current_job&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">:</span>{" "}
            <span className="text-green-600 dark:text-green-400">
              &quot;Full Stack JS Developer&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;
            <span className="text-purple-700 dark:text-purple-400">
              &quot;current_company&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">:</span>{" "}
            <span className="text-green-600 dark:text-green-400">
              &quot;Smart Predict&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;
            <span className="text-purple-700 dark:text-purple-400">
              &quot;education&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">:</span>{" "}
            <span className="text-red-700 dark:text-red-400">[</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Master of Science degree in Big data Intelligence for Human
              Augmented Reality - ESTIA (Bidart, France) & ITUniversity
              (Antananarivo, Madagascar)&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Bachelor&apos;s degree in Computer Science, Development
              option - ITUniversity (Antananarivo, Madagascar)&quot;
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="text-red-700 dark:text-red-400">]</span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;
            <span className="text-purple-700 dark:text-purple-400">
              &quot;fields_of_interests&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">:</span>{" "}
            <span className="text-red-700 dark:text-red-400">[</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Software Development&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Web Development&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Artificial Intelligence&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Data Science&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;UI/UX&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Game Development&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;DevOps&quot;
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="text-red-700 dark:text-red-400">]</span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;
            <span className="text-purple-700 dark:text-purple-400">
              &quot;technical_background&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">:</span>{" "}
            <span className="text-red-700 dark:text-red-400">[</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Full Stack JS Development&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Intern - Software Development&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;End-of-Study Internship for Master&apos;s degree - Mobile
              App Development & Internet Of Things & Data Science&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;End-of-Study Internship for Bachelor&apos;s degree - Web App
              Development&quot;
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="text-red-700 dark:text-red-400">]</span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;
            <span className="text-purple-700 dark:text-purple-400">
              &quot;currently_learning&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">:</span>{" "}
            <span className="text-red-700 dark:text-red-400">[</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;NestJS&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Next.js&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;React&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;GraphQL&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Prisma&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;React Native&quot;
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="text-red-700 dark:text-red-400">]</span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;
            <span className="text-purple-700 dark:text-purple-400">
              &quot;hobbies&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">:</span>{" "}
            <span className="text-red-700 dark:text-red-400">[</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Traveling&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Drawing&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Art&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Music&quot;
            </span>
            <span className="text-blue-800 dark:text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-600 dark:text-green-400">
              &quot;Gaming&quot;
            </span>
            <br />
            <span className="text-red-700 dark:text-red-400">]</span>
            <br />
            <span className="text-blue-800 dark:text-blue-400 -ml-4">
              {"}"}
            </span>
          </pre>
        </motion.div>
      </div>
    </div>
  );
};
export default WhoIs;
