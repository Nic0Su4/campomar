"use client";

import { useEmpleadoStore } from "@/store/empleado";
import { empleados } from "@prisma/client";
import { redirect } from "next/navigation";

const EmpleadoPage = () => {
  const empleado = useEmpleadoStore(
    (state: any) => state.empleado
  ) as empleados | null;

  if (!empleado) {
    redirect("/login");
  }

  return <div>hola {empleado.Nombre}</div>;
};

export default EmpleadoPage;
