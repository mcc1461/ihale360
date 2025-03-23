import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Logo1() {
  return (
    <Link to="/login" className="no-underline">
      <div className="flex flex-col items-center justify-center h-[10vh]">
        <div className="border-4 border-red-500 w-[61px] h-[61px] rounded-full flex items-center justify-center hover:text-white hover:bg-red-500  text-center transition">
          <div className="text-red-500 text-[25px] font-normal hover:text-white transition">
            <img src={logo} alt="" className="h-[55px] rounded-full" />
          </div>
        </div>
        <p className="text-black text-[25px] font-semibold ">MusCo-Store</p>
      </div>
    </Link>
  );
}

export default Logo1;
