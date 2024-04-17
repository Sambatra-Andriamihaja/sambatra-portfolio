/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import Image from "next/image";
import styles from "./ProjectCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMinus,
  faPlus,
  faSquareH,
  faSquareFull,
  faSearch,
  faSquare,
  faTimes,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { GithubIcon } from "@/components/sub/Icons";
import { ITag } from "@/constants/projects";
import SkillImage from "@/components/sub/SkillImage";

interface IProjectCard {
  project: any;
  isMobileCard: boolean;
  isWebCard: boolean;
  isSpecialCard: boolean;
  is1saCard: boolean;
}

function ProjectCard(props: IProjectCard) {
  const { project, isMobileCard, isWebCard, isSpecialCard, is1saCard } = props;

  let cardContent: React.JSX.Element;

  if (isMobileCard) {
    cardContent = (
      <div className={styles.mobileContainer}>
        <div
          className={`${styles.mobile} ${styles.mobileObj}`}
          data-rotx="0"
          data-roty="0"
        >
          <div className={styles.mobileIn}>
            <div className={styles.mobileStatusBar}>
              <div className={styles.mobileNotch}>
                <div className={styles.mobileAudio}></div>
                <div className={styles.mobileCamera}></div>
              </div>
            </div>
            <div className={styles.mobileScreen}>
              {/* <div className={styles.mobileAppCont}></div> */}
              <Image alt={project.title} src={project.img} fill />
            </div>
          </div>

          <div
            className={`${styles.mobileButton} ${styles.mobileButtonRight} ${styles.mobileButtonLarge}`}
          ></div>
          <div
            className={`${styles.mobileButton} ${styles.mobileButtonLeft} ${styles.mobileButtonDown}`}
          ></div>
          <div
            className={`${styles.mobileButton} ${styles.mobileButtonLeft}`}
          ></div>
        </div>
        <div className={styles.mobileShadow}></div>
      </div>
    );
  } else if (isWebCard) {
    cardContent = (
      <div className={styles.pc}>
        <div className={styles.pcScreen}>
          <div
            className={styles.pcViewport}
            style={{
              backgroundImage: `url(${
                project.img ||
                "https://s3-us-west-2.amazonaws.com/s.cdpn.io/451895/datauri-generator-preview.jpg"
              })`,
            }}
          ></div>
        </div>
        <div className={styles.pcBase}></div>
        <div className={styles.pcNotch}></div>
      </div>
    );
  } else if (isSpecialCard) {
    cardContent = (
      <div className={styles.containerTerminal}>
        {/* Special content here */}
      </div>
    );
  } else if (is1saCard) {
    cardContent = (
      <div
        className={`${styles.containerTerminal} scale-75 transform-origin-center`}
      >
        <div className={styles.terminalToolbar}>
          <div className={styles.addTab}>
            {/* <i class="fa fa-plus"></i> */}
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <p className={styles.terminalUserParagraph}>johndoe@admin: ~</p>
          <button className={styles.toolbarBtn}>
            {/* <i className="fa fa-search"></i> */}
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button className={styles.toolbarBtn}>
            {/* <i className="fa fa-bars"></i> */}
            <FontAwesomeIcon icon={faBars} />
          </button>
          <button className={styles.toolbarBtn}>
            {/* <i className="fa fa-minus"></i> */}
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <button className={styles.toolbarBtn}>
            {/* <i className="fa fa-square-o"></i> */}
            <FontAwesomeIcon icon={faExpand} />
          </button>
          <button className={styles.toolbarBtn}>
            {/* <i className="fa fa-times"></i> */}
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={styles.terminalBody}>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalUser}>johndoe@admin:</span>
            <span className={styles.terminalLocation}>~</span>
            <span className={styles.terminalBling}>$ npm install 1sa</span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalBling}>added 1 package in 2 s</span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalBling}>...</span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalUser}>johndoe@admin:</span>
            <span className={styles.terminalLocation}>~</span>
            <span className={styles.terminalBling}>$ node</span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalBling}>
              Welcome to Node.js v16.13.1.
            </span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalBling}>
              Type ".help" for more information.
            </span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalBling}>
              &gt; {`const {isa} = require('1sa');`}
            </span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalBling} style={{ color: "#4E4F4A" }}>
              undefined
            </span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalBling}>
              &gt; console.log(isa(131));
            </span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalBling}>
              {" "}
              iraika amby telopolo amby zato
            </span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalBling} style={{ color: "#4E4F4A" }}>
              undefined
            </span>
          </div>
          <div className={styles.terminalPrompt}>
            <span className={styles.terminalBling}>&gt; </span>
            <span className={styles.terminalCursor}></span>
          </div>
        </div>
      </div>
    );
  } else {
    cardContent = (
      <a
        href={project.link || project.github}
        target="_blank"
        className={`w-full relative rounded-xl border-fun-gray border p-2 transition hover:-translate-y-2 hover:opacity-75 hover:border-fun-pink will-change-projectCard`}
      >
        <Image
          alt={project.title} // Use curly braces for dynamic values
          className="rounded-md"
          src={project.img}
          style={{ minHeight: 180, maxHeight: 180, width: "100%" }}
          width={100}
          height={100}
        />
      </a>
    );
  }

  return (
    <div
      className={`max-w-sm mx-auto flex flex-col projects-center md:projects-start md:justify-center border border-gray-300 rounded-lg overflow-hidden p-6 ${
        !isWebCard ? "items-center" : ""
      }`}
      key={project.id}
    >
      {cardContent}
      <div className="w-full mt-5">
        <div className="flex projects-center justify-between">
          <a href={project.link || project.github} target="_blank">
            <h3 className="text-lg font-bold dark:text-light">
              {project.title}
            </h3>
          </a>
          <div className="space-x-2">
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer">
                {/* <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}static/icons/external-link.svg`}
                  width={16}
                  height={16}
                  alt="Link Icon"
                /> */}
                <GithubIcon />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer">
                {/* <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}static/icons/github.svg`}
                  width={16}
                  height={16}
                  alt="Github Icon"
                /> */}
                <GithubIcon />
              </a>
            )}
          </div>
        </div>
        <p className="text-fun-gray text-left text-sm dark:text-light/80">
          {project.desc}
        </p>
        <div className="flex flex-row justify-around flex-wrap mt-2 gap-2 items-center">
          {project.tags.map((tag: ITag, index: number) => (
            <SkillImage
              key={index}
              src={tag.img}
              name={tag.name}
              width={40}
              height={40}
              index={index}
              className="!w-[60px] !h-[60px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
