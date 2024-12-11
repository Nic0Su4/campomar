import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Trash } from "lucide-react"; // Se agrega Trash y Minus para iconos
import { platos } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  addPlatoToPedido: (platoId: number, cantidad: number) => Promise<void>;
  pedido: any;
}

interface PedidoItem extends platos {
  Cantidad: number;
}

export const MesaOcupadaAgregar = ({ addPlatoToPedido, pedido }: Props) => {
  const [orderItems, setOrderItems] = useState<PedidoItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platos, setPlatos] = useState<PedidoItem[]>([]);
  const [filteredPlatos, setFilteredPlatos] = useState<PedidoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("");

  // useEffect para hacer fetch de los platos
  useEffect(() => {
    const fetchPlatos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/platos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los platos");
        }

        const data = await response.json();
        setPlatos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlatos();
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

    if (!pedido) return;
    console.log(pedido.detalles);

    const uniqueFilteredPlatos = categoryFiltered.filter(
      (plato) =>
        !pedido.detalles.some(
          (orderItem: any) => orderItem.PlatoID === plato.PlatoID
        )
    );

    setFilteredPlatos(uniqueFilteredPlatos);
  }, [searchTerm, filterCategory, platos, pedido]);

  const addToOrder = (plato: PedidoItem) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem.PlatoID === plato.PlatoID
    );
    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem: PedidoItem) =>
          orderItem.PlatoID === plato.PlatoID
            ? { ...orderItem, Cantidad: orderItem.Cantidad + 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems([...orderItems, { ...plato, Cantidad: 1 }]);
    }
  };

  const removeFromOrder = (plato: PedidoItem) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem.PlatoID === plato.PlatoID
    );
    if (existingItem && existingItem.Cantidad > 1) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.PlatoID === plato.PlatoID
            ? { ...orderItem, Cantidad: orderItem.Cantidad - 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems(
        orderItems.filter((orderItem) => orderItem.PlatoID !== plato.PlatoID)
      );
    }
  };

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
    return <div>Cargando...</div>;
  }

  const handleAddPlatos = async () => {
    setIsLoading(true);
    try {
      await Promise.all(
        orderItems.map((item) => addPlatoToPedido(item.PlatoID, item.Cantidad))
      );
      setOrderItems([]); // Limpia el carrito después de agregar
    } catch (error) {
      console.error("Error al agregar los platos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Agregar plato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-[400px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Agregar plato</DialogTitle>
          <DialogDescription>
            Añade platos a la mesa, recuerda que puedes modificar la cantidad de
            cada plato en la mesa.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row p-2 gap-8 max-w-[80vw]">
          <div className="w-full space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Menú</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[55vh] overflow-y-auto">
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Buscar platos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                </div>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plato</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlatos.map((item) => (
                      <TableRow key={item.PlatoID}>
                        <TableCell>{item.Descripcion}</TableCell>
                        <TableCell>
                          S/. {Number(item.Precio!).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => addToOrder(item)}>
                            <Plus className="w-4 h-4 mr-2" /> Agregar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="w-full md:w-1/2 space-y-6 min-w-[30vw] overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[55vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plato</TableHead>
                      <TableHead>Cant.</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.PlatoID}>
                        <TableCell>{item.Descripcion}</TableCell>
                        <TableCell>{item.Cantidad}</TableCell>
                        <TableCell>
                          S/. {Number(item.Precio!).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          S/.{" "}
                          {(Number(item.Precio ?? 0) * item.Cantidad).toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromOrder(item)}
                          >
                            <Trash className="w-4 h-4 mr-2" /> Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddPlatos} disabled={isLoading}>
            Agregar platos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
