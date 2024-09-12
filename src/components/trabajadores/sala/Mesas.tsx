"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Mesas = () => {
  const router = useRouter();
  const [selectedTables, setSelectedTables] = useState<number[]>([]);

  const handleSelectTable = (table: number) => {
    setSelectedTables((prev: any) =>
      prev.includes(table)
        ? prev.filter((t: number) => t !== table)
        : [...prev, table]
    );
  };

  const hadleGoToTable = () => {
    router.push(`/empleado/sala/mesa/${selectedTables[0]}`);
  };

  return (
    <Card className="w-[360px] sm:w-[560px] md:w-[660px] lg:w-[900px] xl:w-[1100px]">
      <CardHeader>
        <CardTitle>Sala del Restaurante</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20,
          ].map((table) => (
            <Button
              key={table}
              onClick={() => handleSelectTable(table)}
              variant={selectedTables.includes(table) ? "default" : "outline"}
              className={`${
                selectedTables.includes(table)
                  ? "bg-brandPrimary hover:bg-brandSecondary"
                  : ""
              }`}
            >
              Mesa {table}
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
            disabled={selectedTables.length === 0}
          >
            Ir a la Carta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
