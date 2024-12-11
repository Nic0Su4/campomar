"use client";

import { CardEmpleado } from "@/components/trabajadores/CardEmpleado";
import { useEmpleadoStore } from "@/store/empleado";
import { empleados } from "@prisma/client";
import { Armchair, BookOpen, HandPlatter } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const EmpleadoPage = () => {
  const empleado = useEmpleadoStore(
    (state: any) => state.empleado
  ) as empleados | null;

  const setEmpleado = useEmpleadoStore((state: any) => state.setEmpleado);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmpleado = localStorage.getItem("empleado");
      if (storedEmpleado && !empleado) {
        setEmpleado(JSON.parse(storedEmpleado));
      } else if (!storedEmpleado) {
        redirect("/login");
      }
      setLoading(false);
    }
  }, [empleado, setEmpleado]);

  if (loading && !empleado) {
    return <div>Cargando...</div>;
  }

  if (!empleado) {
    redirect("/login");
  }

  return (
    <div className="flex gap-6 flex-col md:flex-row justify-around items-center w-4/5">
      <CardEmpleado
        texto="Ver Sala"
        icono={<Armchair size={60} />}
        direccion="/empleado/sala"
      />
      <CardEmpleado
        texto="Ver Carta"
        icono={<BookOpen size={60} />}
        direccion="/empleado/carta"
      />
      <CardEmpleado
        texto="Pedidos"
        icono={<HandPlatter size={60} />}
        direccion="/empleado/pedidos"
      />
    </div>
  );
};

export default EmpleadoPage;
