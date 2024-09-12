"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("empleado");
    router.push("/login");
  };

  return (
    <div>
      <LogOut
        onClick={handleLogout}
        size={50}
        className="text-brandPrimary rotate-180 cursor-pointer"
        strokeWidth={3}
      />
    </div>
  );
};
