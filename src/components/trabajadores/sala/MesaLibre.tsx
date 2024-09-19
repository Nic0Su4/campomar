import { useState, useMemo, useEffect } from "react";
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
import { Plus, ShoppingCart, Search, Minus, Trash } from "lucide-react"; // Se agrega Trash y Minus para iconos
import { platos, Prisma } from "@prisma/client";

interface OrderItem extends platos {
  quantity: number;
}

export default function MesaLibre() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platos, setPlatos] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const addToOrder = (plato: OrderItem) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem.PlatoID === plato.PlatoID
    );
    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem: OrderItem) =>
          orderItem.PlatoID === plato.PlatoID
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems([...orderItems, { ...plato, quantity: 1 }]);
    }
  };

  const removeFromOrder = (plato: OrderItem) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem.PlatoID === plato.PlatoID
    );
    if (existingItem && existingItem.quantity > 1) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.PlatoID === plato.PlatoID
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems(
        orderItems.filter((orderItem) => orderItem.PlatoID !== plato.PlatoID)
      );
    }
  };

  const filteredMenuItems = useMemo(() => {
    return platos.filter((item) =>
      item.Descripcion!.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, platos]);

  const total = orderItems.reduce(
    (sum, item) => sum + Number(item.Precio) * item.quantity,
    0
  );

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="bg-primary text-primary-foreground p-6">
          <h1 className="text-3xl font-bold">Nuevo Pedido</h1>
        </header>
        <div className="flex flex-col md:flex-row p-6 gap-8">
          <div className="w-full md:w-1/2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Menú</CardTitle>
              </CardHeader>
              <CardContent>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plato</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMenuItems.map((item) => (
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
          <div className="w-full md:w-1/2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
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
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          S/. {Number(item.Precio!).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          S/.{" "}
                          {(Number(item.Precio ?? 0) * item.quantity).toFixed(
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
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-semibold">
                    Total: S/. {total.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Button
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
