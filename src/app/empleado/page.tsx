"use client";

import { useEmpleadoStore } from "@/store/empleado";
import { redirect } from "next/navigation";

const EmpleadoPage = () => {
  const empleado = useEmpleadoStore((state: any) => state.empleado);

  if (!empleado) {
    redirect("/login");
  }

  return <div>empleado page</div>;
};

export default EmpleadoPage;
