"use client";

import React, { useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { mesas } from "@prisma/client";
import { Spinner } from "../ui/spinner";

export const GestionMesas = () => {
  const [tables, setTables] = useState<mesas[]>([]);
  const [newTable, setNewTable] = useState<mesas>({
    MesaID: 0,
    NumeroMesa: 0,
    Estado: "Libre",
  });
  const [editingTable, setEditingTable] = useState<mesas | null>(null);
  const [loadingTables, setLoadingTables] = useState<boolean>(false);

  useEffect(() => {
    // Fetch para obtener las mesas al cargar el componente
    const fetchTables = async () => {
      try {
        const response = await fetch("/api/mesas", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Error al obtener las mesas");
        }

        const mesas = await response.json();
        setTables(mesas);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTables();
  }, []);

  const handleAddTable = async () => {
    if (newTable?.NumeroMesa && newTable.Estado) {
      setLoadingTables(true);
      try {
        const response = await fetch("/api/mesas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            NumeroMesa: newTable.NumeroMesa,
            Estado: newTable.Estado,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al agregar la mesa");
        }

        const mesa = await response.json();

        // Actualiza la lista de mesas con la mesa recién creada
        setTables([...tables, mesa]);

        // Resetea el formulario de nueva mesa
        setNewTable({
          MesaID: 0,
          Estado: "Libre",
          NumeroMesa: 0,
        });
      } catch (error) {
        console.error(error);
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        setLoadingTables(false);
      }
    }
  };

  const handleEditTable = async () => {
    if (editingTable?.NumeroMesa && editingTable.Estado) {
      setLoadingTables(true);

      try {
        const response = await fetch(`/api/mesas/${editingTable.MesaID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            NumeroMesa: editingTable.NumeroMesa,
            Estado: editingTable.Estado,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar la mesa");
        }

        const updatedMesa = await response.json();

        setTables((prevTables) =>
          prevTables.map((mesa) =>
            mesa.MesaID === updatedMesa.MesaID ? updatedMesa : mesa
          )
        );

        // Limpiar el formulario de edición
        setEditingTable(null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTables(false);
      }
    }
  };

  // Funciones para eliminar elementos
  const handleDeleteTable = async (id: number) => {
    try {
      const response = await fetch(`/api/mesas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la mesa");
      }

      // Eliminar la mesa del estado local
      setTables(tables.filter((table) => table.MesaID !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const selectTableForEdit = (table: mesas) => {
    setEditingTable(table);
  };

  return (
    <TabsContent value="tables">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Mesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="tableNumber">
                {editingTable ? "Editar Mesa" : "Número de Mesa"}
              </Label>
              <Input
                id="tableNumber"
                value={
                  editingTable ? editingTable.NumeroMesa : newTable.NumeroMesa
                }
                onChange={(e) =>
                  editingTable
                    ? setEditingTable({
                        ...editingTable,
                        NumeroMesa: Number(e.target.value),
                      })
                    : setNewTable({
                        ...newTable,
                        NumeroMesa: Number(e.target.value),
                      })
                }
                placeholder="Número de Mesa"
                type="number"
              />
            </div>
            <Button
              onClick={editingTable ? handleEditTable : handleAddTable}
              className="mt-auto"
              disabled={loadingTables}
            >
              {loadingTables ? (
                <>
                  <Spinner /> {editingTable ? "Guardando..." : "Cargando..."}
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {editingTable ? "Guardar Cambios" : "Añadir Mesa"}
                </>
              )}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.MesaID}>
                  <TableCell>{table.NumeroMesa}</TableCell>
                  <TableCell>{table.Estado}</TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => selectTableForEdit(table)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTable(table.MesaID)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
