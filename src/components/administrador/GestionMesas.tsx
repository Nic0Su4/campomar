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
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
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
        setTables([...tables, mesa]);
        setNewTable({
          MesaID: 0,
          Estado: "Libre",
          NumeroMesa: 0,
        });
      } catch (error) {
        console.error(error);
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

        setEditingTable(null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTables(false);
      }
    }
  };

  const handleDeleteTable = async (id: number) => {
    try {
      const response = await fetch(`/api/mesas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la mesa");
      }

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
      <Card className="border-t-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Gestión de Mesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="tableNumber" className="text-sm font-medium text-gray-700">
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
                className="mt-1 border-gray-300 focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
              />
            </div>
            <Button
              onClick={editingTable ? handleEditTable : handleAddTable}
              className="mt-auto bg-gray-800 hover:bg-gray-700 text-white"
              disabled={loadingTables}
            >
              {loadingTables ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> {editingTable ? "Guardando..." : "Cargando..."}
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {editingTable ? "Guardar Cambios" : "Añadir Mesa"}
                </>
              )}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Número</TableHead>
                  <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                  <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.MesaID} className="hover:bg-gray-50 transition-colors">
                    <TableCell>{table.NumeroMesa}</TableCell>
                    <TableCell>{table.Estado}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => selectTableForEdit(table)}
                          className="text-gray-600 hover:text-gray-800 hover:border-gray-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTable(table.MesaID)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

