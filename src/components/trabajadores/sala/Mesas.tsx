"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { mesas } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Mesas = () => {
  const router = useRouter();
  const [mesas, setMesas] = useState<mesas[]>([]);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const response = await fetch("/api/mesas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las mesas");
        }

        const data = await response.json();
        setMesas(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMesas();
  }, []); // Solo se ejecuta al montar el componente

  const handleSelectTable = (table: number) => {
    setSelectedTables((prev: any) =>
      prev.includes(table)
        ? prev.filter((t: number) => t !== table)
        : [...prev, table]
    );
  };

  const hadleGoToTable = () => {
    setIsLoading(true);
    const selectedTablesQuery = selectedTables.join(",");
    router.push(`/empleado/sala/mesa?mesas=${selectedTablesQuery}`);
  };

  return (
    <Card className="w-[360px] sm:w-[560px] md:w-[660px] lg:w-[900px] xl:w-[1100px]">
      <CardHeader>
        <CardTitle>Sala del Restaurante</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
          {mesas.map((mesa) => (
            <Button
              key={mesa.MesaID}
              onClick={() => handleSelectTable(mesa.MesaID)}
              variant={
                selectedTables.includes(mesa.MesaID) ? "default" : "outline"
              }
              className={`${
                selectedTables.includes(mesa.MesaID)
                  ? "bg-brandPrimary hover:bg-brandSecondary"
                  : ""
              }`}
            >
              Mesa {mesa.MesaID}
            </Button>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            Mesas seleccionadas:
            {selectedTables.map((table) => (
              <Badge key={table} variant="secondary" className="ml-2">
                {table}
              </Badge>
            ))}
          </div>
          <Button
            onClick={hadleGoToTable}
            disabled={selectedTables.length === 0 || isLoading}
            className="flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Spinner size="medium" className="mr-2 text-white" />
                Cargando...
              </>
            ) : (
              "Ir a la Carta"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
