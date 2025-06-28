import React from "react";
import UI_IMG from "../../assets/images/profile.png";
const AuthLayout = ({ children }) => {
  return (
    <div className="login flex pl-14 image-layout ">
      <div className="w-screen h-[93vh] md:w-[60vw] pt-8 pb-10">
        <h2 className="text-2xl font-medium text-black">
          Task{" "}
          <span className="task-anime">
            <span className="letter">M</span>
            <span className="letter">a</span>
            <span className="letter">n</span>
            <span className="letter">a</span>
            <span className="letter">g</span>
            <span className="letter">e</span>
            <span className="letter">r</span>
          </span>
        </h2>
        {children}
      </div>

      <div className=" hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url('/bg-img.png')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
       
      </div>
    </div>
  );
};

export default AuthLayout;
