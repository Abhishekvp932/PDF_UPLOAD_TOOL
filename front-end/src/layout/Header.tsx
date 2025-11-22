"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { clearUser } from "../features/userSlice";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Header() {
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.user.email);
  const navigate = useNavigate();

  useEffect(()=>{
    if(!email){
      navigate('/');
    }
  },[email,navigate]);
  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/');
  };

  return (
    <header className="w-full fixed top-0 left-0 bg-white shadow-md py-4 px-6 flex justify-between items-center z-50">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome{email ? `, ${email}` : ""}
      </h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
}
