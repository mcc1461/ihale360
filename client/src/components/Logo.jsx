import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Adjust the path to where your logo is stored

function Logo() {
  return (
    <Link to="/login" className="text-white no-underline">
      <div className="flex flex-col items-center justify-center h-[10vh]">
        <div className="border-4 border-white w-[77px] h-[77px] rounded-full flex items-center justify-center hover:text-red-500 hover:bg-white text-center transition">
          <div className="text-red-500 text-[25px] font-normal hover:text-white transition">
            <img src={logo} alt="Logo" className="h-[51px] rounded-full" />
          </div>
        </div>
        <p className="hover:text-slate-200 text-[30px] font-semibold">
          MusCo-Store
        </p>
      </div>
    </Link>
  );
}

export default Logo;
