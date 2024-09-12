"use client";

import React from "react";
import Clock from "react-live-clock";

export const Reloj = () => {
  return (
    <div className="w-screen flex flex-col items-start before:content-[''] before:block before:w-full before:h-5 before:bg-brandSecondary">
      <div className="flex flex-col pb-4 pt-8 px-8">
        <Clock format={"D-MM-YYYY"} ticking={true} timezone={"America/Lima"} />
        <Clock format={"HH:mm a"} ticking={true} timezone={"America/Lima"} />
      </div>
    </div>
  );
};
