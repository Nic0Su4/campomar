import Link from "next/link";
import React from "react";

interface CardEmpleadoProps {
  texto: string;
  icono: React.ReactNode;
  direccion: string;
}

export const CardEmpleado = ({
  texto,
  icono,
  direccion,
}: CardEmpleadoProps) => {
  return (
    <Link
      href={`${direccion}`}
      className="md:h-[400px] h-2/3 w-60 flex flex-col gap-4 justify-center items-center border-4 border-black rounded-3xl p-4 hover:bg-black hover:text-white group hover:border-blue-600"
    >
      <div className="text-brandTertiary group-hover:text-brandPrimary">
        {icono}
      </div>
      <p className="text-xl font-bold">{texto}</p>
    </Link>
  );
};
