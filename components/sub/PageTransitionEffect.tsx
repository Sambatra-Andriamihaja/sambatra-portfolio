"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef } from "react";

function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

const transitionVariants: Variants = {
  initial: {
    x: "100%",
    width: "100%",
  },
  animate: {
    x: "0%",
    width: "0%",
  },
};

const PageTransitionEffect = ({ children }: { children: React.ReactNode }) => {
  // The `key` is tied to the url using the `usePathname` hook.
  const key = usePathname();

  return (
    <AnimatePresence mode="wait">
      <div key={key}>
        <motion.div
          className="fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-offDark dark:bg-offLight"
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit={{
            x: ["0%", "100%"],
            width: ["0%", "100%"],
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        <motion.div
          className="fixed top-0 bottom-0 right-full w-screen h-screen z-20 bg-dark dark:bg-light"
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2, duration: 0.4, ease: "easeInOut" }}
        />
        <motion.div
          className="fixed top-0 bottom-0 right-full w-screen h-screen z-10 bg-blueDark dark:bg-white"
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4, duration: 0.4, ease: "easeInOut" }}
        />
        <FrozenRouter>{children}</FrozenRouter>
      </div>
    </AnimatePresence>
  );
};

export default PageTransitionEffect;
