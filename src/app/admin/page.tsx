"use client";

import { useEmpleadoStore } from "@/store/empleado";
import { redirect } from "next/navigation";

const AdminPage = () => {
  const empleado = useEmpleadoStore((state: any) => state.empleado);

  if (!empleado) {
    redirect("/login");
  }

  return <div>admin page</div>;
};

export default AdminPage;
