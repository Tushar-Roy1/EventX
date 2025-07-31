// import React from 'react'
import { FaCopyright } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="w-full mt-12">
      <div className="bg-black h-12 w-full flex items-center justify-center text-white gap-2">
        <FaCopyright className="h-4 w-4" />
        <span className="text-sm">2025 EventX. All rights reserved.</span>
      </div>
    </div>
  );
}
