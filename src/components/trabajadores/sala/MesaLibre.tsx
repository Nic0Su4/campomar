"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ShoppingCart, Search, Trash } from 'lucide-react';
import { empleados, mesas, platos } from "@prisma/client";
import { useEmpleadoStore } from "@/store/empleado";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MesaProps {
  mesas: mesas[];
}

interface PedidoItem extends platos {
  Cantidad: number;
}

export default function MesaLibre({ mesas }: MesaProps) {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<PedidoItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platos, setPlatos] = useState<PedidoItem[]>([]);
  const [filteredPlatos, setFilteredPlatos] = useState<PedidoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const empleado: empleados = useEmpleadoStore((state: any) => state.empleado);
  const [filterCategory, setFilterCategory] = useState<string>("");

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
    const categoryFiltered = filtered.filter((plato) => {
      if (filterCategory === "todos" || filterCategory === "") {
        return true;
      }
      return plato.CategoriaID === parseInt(filterCategory);
    });
    setFilteredPlatos(categoryFiltered);
  }, [searchTerm, filterCategory, platos]);

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

  const total = orderItems.reduce(
    (sum, item) => sum + (Number(item.Precio) ?? 0) * item.Cantidad,
    0
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-8rem)]">Cargando...</div>;
  }

  const handleRealizarPedido = async () => {
    try {
      const nuevoPedido = {
        EmpleadoID: empleado.EmpleadoID,
        Fecha: new Date(),
        Total: total,
      };

      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoPedido),
      });

      if (!response.ok) {
        throw new Error("Error al crear el pedido");
      }

      const pedido = await response.json();
      const PedidoID = pedido.PedidoID;

      await Promise.all(
        orderItems.map((item) =>
          fetch("/api/detallepedidos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              PedidoID,
              PlatoID: item.PlatoID,
              Cantidad: item.Cantidad,
            }),
          })
        )
      );

      const mesasRelacionadas = mesas.map((mesa) => ({
        PedidoID,
        MesaID: mesa.MesaID,
      }));

      await Promise.all(
        mesasRelacionadas.map((mesa) =>
          fetch("/api/pedido_mesas", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mesa),
          })
        )
      );

      const mesasActualizadas = mesas.map((mesa) => ({
        ...mesa,
        Estado: "Ocupada",
      }));

      await Promise.all(
        mesasActualizadas.map((mesa) =>
          fetch(`/api/mesas/${mesa.MesaID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mesa),
          })
        )
      );

      setOrderItems([]);
      router.push("/empleado");
      alert("Pedido realizado correctamente");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al realizar el pedido");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-8 mt-3 mb-3">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <header className="bg-primary text-primary-foreground p-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Nuevo Pedido - Mesa(s) {mesas.map((mesa) => mesa.MesaID).join(", ")}
          </h1>
        </header>
        <div className="flex flex-col lg:flex-row p-4 sm:p-6 gap-6 lg:gap-8">
          <div className="w-full lg:w-1/2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Menú</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                  <div className="relative w-full sm:w-2/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar platos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-full sm:w-1/3">
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
                <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
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
                          <TableCell className="font-medium">{item.Descripcion}</TableCell>
                          <TableCell>S/. {Number(item.Precio!).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => addToOrder(item)}>
                              <Plus className="w-4 h-4 mr-2" /> Agregar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[calc(100vh-28rem)] overflow-y-auto mb-4">
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
                          <TableCell className="font-medium">{item.Descripcion}</TableCell>
                          <TableCell>{item.Cantidad}</TableCell>
                          <TableCell>S/. {Number(item.Precio!).toFixed(2)}</TableCell>
                          <TableCell>
                            S/. {(Number(item.Precio ?? 0) * item.Cantidad).toFixed(2)}
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
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-xl font-semibold">Total:</span>
                  <span className="text-2xl font-bold">S/. {total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            <Button
              onClick={handleRealizarPedido}
              className="w-full"
              size="lg"
              disabled={orderItems.length === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" /> Realizar Pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

