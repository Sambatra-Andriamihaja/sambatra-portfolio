import React from "react";

interface ILayout {
  children: React.ReactNode;
  className: string;
}

const Layout = (props: ILayout) => {
  const { children, className = "" } = props;

  return (
    <div
      className={`w-full h-full inline-block z-0 bg-light dark:bg-dark p-32 ${className}`}
    >
      {children}
    </div>
  );
};

export default Layout;
