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
  const [selectedTables, setSelectedTables] = useState<mesas[]>([]);
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

  const handleSelectTable = (table: mesas) => {
    setSelectedTables((prev: any) =>
      prev.includes(table)
        ? prev.filter((t: mesas) => t.MesaID !== table.MesaID)
        : [...prev, table]
    );
  };

  const hadleGoToTable = () => {
    setIsLoading(true);

    if (selectedTables.length === 0) {
      setIsLoading(false);
      return;
    }

    if (selectedTables.some((table) => table.Estado === "Ocupada")) {
      alert("Al menos una mesa seleccionada está ocupada");
      setIsLoading(false);
      return;
    }

    const selectedTablesQuery = selectedTables
      .map((table) => table.MesaID)
      .join(",");

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
              onClick={
                mesa.Estado == "Libre"
                  ? () => handleSelectTable(mesa)
                  : async () => {
                      setIsLoading(true);
                      try {
                        const response = await fetch(
                          `/api/mesas/relacion?mesaId=${mesa.MesaID}`,
                          {
                            method: "GET",
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        );

                        if (!response.ok) {
                          alert("Error al obtener la mesa");
                          setIsLoading(false);
                          return;
                        }

                        const data = await response.json();

                        const mesasRelacionadas = data.map(
                          (mesa: mesas) => mesa.MesaID
                        );

                        router.push(
                          `/empleado/sala/mesa?mesas=${mesasRelacionadas.join(
                            ","
                          )}`
                        );
                      } catch (error) {
                        console.error(error);
                      }
                    }
              }
              variant={selectedTables.includes(mesa) ? "default" : "outline"}
              className={`${
                selectedTables.includes(mesa)
                  ? "bg-brandPrimary hover:bg-brandSecondary"
                  : ""
              } ${
                mesa.Estado === "Ocupada"
                  ? "bg-red-500 text-white hover:bg-red-600 hover:text-white"
                  : ""
              }`}
            >
              {isLoading ? (
                <Spinner size="small" className="mr-2 text-white" />
              ) : (
                `Mesa ${mesa.NumeroMesa}`
              )}
            </Button>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            Mesas seleccionadas:
            {selectedTables.map((table) => (
              <Badge key={table.MesaID} variant="secondary" className="ml-2">
                {table.NumeroMesa}
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
