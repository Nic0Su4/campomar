"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEmpleadoStore } from "@/store/empleado";
import { empleados, mesas } from "@prisma/client";
import { Clock, Edit, Plus, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const MesaOcupada = () => {
  const empleado: empleados = useEmpleadoStore((state: any) => state.empleado);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedTables, setSelectedTables] = useState<number[]>([]);

  useEffect(() => {
    const mesasParam = searchParams.get("mesas");
    if (mesasParam) {
      const mesasArray = mesasParam.split(",").map(Number); // Convertir la cadena a un array de números
      setSelectedTables(mesasArray);
    }
  }, [searchParams]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-[600px] px-8 lg:px-0">
      <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="bg-brandSecondary text-primary-foreground p-6">
          <h1 className="text-3xl font-bold">Realizar pedido</h1>
        </header>
        <div className="flex flex-col md:flex-row p-6 gap-8">
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-secondary p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Mesa(s) {selectedTables.join(", ")}
              </h2>
              <div className="flex justify-between items-center">
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  Ocupado
                </span>
              </div>
              <div className="mt-4 flex items-center text-muted-foreground">
                <Clock className="w-5 h-5 mr-2" />
                <span>Tiempo: 1:30:20</span>
              </div>
              <div className="mt-2 text-muted-foreground">
                Moz@: {empleado.Nombre}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Agregar
              </Button>
              <Button variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" /> Modificar
              </Button>
              <Button variant="destructive" className="w-full">
                <X className="w-4 h-4 mr-2" /> Cancelar Pedido
              </Button>
            </div>
            <Button variant="link" className="w-full" onClick={handleGoBack}>
              ← Volver
            </Button>
          </div>
          <div className="w-full md:w-2/3 space-y-6">
            <h2 className="text-2xl font-semibold">Pedido:</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Plato</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead>Precio U.</TableHead>
                  <TableHead>Precio T.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>001</TableCell>
                  <TableCell>Caldo de Gallina</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>S/. 12.00</TableCell>
                  <TableCell>S/. 24.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total: S/. 24.00</span>
              <Button size="lg">Pagar</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
