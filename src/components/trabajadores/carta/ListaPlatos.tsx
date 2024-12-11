"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { platos } from "@prisma/client";

async function fetchPlatos(): Promise<platos[]> {
  const response = await fetch("/api/platos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los platos");
  }

  return response.json();
}

const categorias = {
  1: "Criollo",
  2: "Bebida",
  3: "Porción",
  4: "Caldo",
  5: "Otro",
};

export function ListaPlatos() {
  const [platos, setPlatos] = useState<platos[]>([]);
  const [filteredPlatos, setFilteredPlatos] = useState<platos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    fetchPlatos()
      .then((data) => {
        setPlatos(data);
        setFilteredPlatos(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = platos.filter((plato) =>
      plato.Descripcion!.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // código para filtar por categoría
    const categoryFiltered = filtered.filter((plato) => {
      if (filterCategory === "todos" || filterCategory === "") {
        return true;
      }
      return plato.CategoriaID === parseInt(filterCategory);
    });
    setFilteredPlatos(categoryFiltered);
  }, [searchTerm, filterCategory, platos]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Menú de Platos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="Buscar plato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="1">Criollo</SelectItem>
              <SelectItem value="2">Bebida</SelectItem>
              <SelectItem value="3">Porción</SelectItem>
              <SelectItem value="4">Caldo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Categoría</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlatos.map((plato) => (
              <TableRow key={plato.PlatoID}>
                <TableCell>{plato.Descripcion}</TableCell>
                <TableCell className="text-right">
                  S/{plato.Precio!.toString()}
                </TableCell>
                <TableCell className="text-right">
                  {categorias[plato.CategoriaID] || "Otro"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
