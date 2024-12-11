"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Search } from "lucide-react";
import OrderTable from "@/components/trabajadores/pedidos/OrderTable";

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="max-h-screen h-[70vh] flex flex-col bg-gray-100 overflow-auto">
      <header className="bg-primary text-primary-foreground p-4 rounded-md">
        <h1 className="text-2xl font-bold">Pedidos</h1>
      </header>
      <main className="flex-grow p-4 overflow-hidden">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Lista de Pedidos</CardTitle>
            <Button size="sm" onClick={handleRefresh}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar por mesa..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-grow"
              />
            </div>
            <OrderTable searchTerm={searchTerm} refreshKey={refreshKey} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrdersPage;
