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
import { empleados, platos } from "@prisma/client";
import { Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const GestionPlatos = () => {
  const [dishes, setDishes] = useState<platos[]>([]);
  const [newDish, setNewDish] = useState<platos>({
    PlatoID: 0,
    Descripcion: "",
    Precio: 0,
    CategoriaID: 0,
  });
  const [editingDish, setEditingDish] = useState<platos | null>(null);
  const [loadingDishes, setLoadingDishes] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Fetch para obtener los platos al cargar el componente
    const fetchDishes = async () => {
      try {
        const response = await fetch("/api/platos", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Error al obtener los platos");
        }

        const platos = await response.json();
        setDishes(platos);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDishes();
  }, []);

  const handleAddDish = async () => {
    if (newDish?.Descripcion && newDish.Precio && newDish.CategoriaID) {
      setLoadingDishes(true);
      try {
        const response = await fetch("/api/platos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Descripcion: newDish.Descripcion,
            Precio: newDish.Precio,
            CategoriaID: newDish.CategoriaID,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al añadir el plato");
        }

        const plato = await response.json();
        setDishes([...dishes, plato]);
        setNewDish({
          PlatoID: 0,
          Descripcion: "",
          Precio: 0,
          CategoriaID: 0,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDishes(false);
      }
    }
  };

  const handleEditDish = async () => {
    if (
      editingDish?.Descripcion &&
      editingDish?.Precio &&
      editingDish?.CategoriaID
    ) {
      setLoadingDishes(true);
      try {
        const response = await fetch(`/api/platos/${editingDish.PlatoID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Descripcion: editingDish.Descripcion,
            Precio: editingDish.Precio,
            CategoriaID: editingDish.CategoriaID,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al editar el plato");
        }

        const updatedPlato = await response.json();

        setDishes((prevDishes) =>
          prevDishes.map((dish) =>
            dish.PlatoID === updatedPlato.PlatoID ? updatedPlato : dish
          )
        );
        setEditingDish(null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDishes(false);
      }
    }
  };

  const handleDeleteDish = async (PlatoID: number) => {
    try {
      const response = await fetch(`/api/platos/${PlatoID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el plato");
      }

      setDishes(dishes.filter((dish) => dish.PlatoID !== PlatoID));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectDish = (dish: platos) => {
    setEditingDish(dish);
  };

  const filteredDishes = dishes.filter((dish) =>
    dish.Descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TabsContent value="dishes">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Platos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="dishDescription">
                {editingDish ? "Editar Descripción" : "Descripción"}
              </Label>
              <Input
                id="dishDescription"
                value={
                  editingDish ? editingDish.Descripcion! : newDish.Descripcion!
                }
                onChange={(e) =>
                  editingDish
                    ? setEditingDish({
                        ...editingDish,
                        Descripcion: e.target.value,
                      })
                    : setNewDish({
                        ...newDish,
                        Descripcion: e.target.value,
                      })
                }
                placeholder="Descripción del Plato"
                type="text"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="dishPrice">
                {editingDish ? "Editar Precio" : "Precio"}
              </Label>
              <Input
                id="dishPrice"
                value={editingDish ? editingDish.Precio! : newDish.Precio!}
                onChange={(e) =>
                  editingDish
                    ? setEditingDish({
                        ...editingDish,
                        Precio: Number(e.target.value),
                      })
                    : setNewDish({
                        ...newDish,
                        Precio: Number(e.target.value),
                      })
                }
                placeholder="Precio"
                type="number"
                step="0.01"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="employeeRole">Categoría</Label>
              <Select
                required
                value={
                  editingDish
                    ? editingDish.CategoriaID?.toString()
                    : newDish.CategoriaID?.toString()
                }
                onValueChange={(value) => {
                  editingDish
                    ? setEditingDish({
                        ...editingDish,
                        CategoriaID: Number(value),
                      })
                    : setNewDish({
                        ...newDish,
                        CategoriaID: Number(value),
                      });
                }}
              >
                <SelectTrigger id="dishCategory">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Criollo</SelectItem>
                  <SelectItem value="2">Bebida</SelectItem>
                  <SelectItem value="3">Porcion</SelectItem>
                  <SelectItem value="4">Caldo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={editingDish ? handleEditDish : handleAddDish}
              className="mt-auto"
              disabled={loadingDishes}
            >
              {loadingDishes ? (
                <>
                  <Spinner /> {editingDish ? "Guardando..." : "Cargando..."}
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {editingDish ? "Guardar Cambios" : "Añadir Plato"}
                </>
              )}
            </Button>
          </div>
          {/* Barra de búsqueda */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Buscar por descripción"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 mb-4 rounded"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDishes.map((dish) => (
                <TableRow key={dish.PlatoID}>
                  <TableCell>{dish.Descripcion}</TableCell>
                  <TableCell>{dish.Precio ?? 0}</TableCell>
                  <TableCell>
                    {dish.CategoriaID === 1
                      ? "Criollo"
                      : dish.CategoriaID === 2
                      ? "Bebida"
                      : dish.CategoriaID === 3
                      ? "Porción"
                      : dish.CategoriaID === 4
                      ? "Caldo"
                      : "Otro"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSelectDish(dish)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDish(dish.PlatoID)}
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
