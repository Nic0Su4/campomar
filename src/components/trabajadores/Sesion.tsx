"use client";
import { useEmpleadoStore } from "@/store/empleado";
import { empleados } from "@prisma/client";
import { User } from "lucide-react";
import Link from "next/link";

const Sesion = () => {
  const empleado: empleados = useEmpleadoStore((state: any) => state.empleado);

  return (
    <div className="flex justify-center items-center gap-4">
      <div className="flex flex-col">
        <p className="text-3xl tracking-wider">{empleado.Nombre}</p>
        <Link
          className="text-xs text-end text-blue-600"
          href="/empleado/perfil"
        >
          Ver perfil
        </Link>
      </div>
      <div>
        <User size={60} />
      </div>
    </div>
  );
};

export default Sesion;
