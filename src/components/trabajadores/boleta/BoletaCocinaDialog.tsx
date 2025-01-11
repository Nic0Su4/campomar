"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import BoletaCocina from "@/components/trabajadores/boleta/BoletaCocina"; // Asegúrate de importar el componente correcto
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShoppingCart } from "lucide-react";

export default function BoletaCocinaDialog({
  mesas,
  handleRealizarPedido,
  orderItems,
}: {
  mesas: any[];
  handleRealizarPedido: () => void;
  orderItems: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Configuración de impresión
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Boleta-Cocina`,
    onAfterPrint: () => console.log("Impresión completada."),
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            setIsOpen(true);
          }}
          disabled={orderItems.length === 0}
        >
          <ShoppingCart className="w-5 h-5 mr-2" /> Realizar Pedido
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Boleta de Cocina - Mesa(s){" "}
            {mesas.map((mesa) => mesa.NumeroMesa).join(", ")}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[80vh] overflow-y-auto">
          {/* Boleta de Cocina */}
          <BoletaCocina
            ref={receiptRef}
            orderItems={orderItems}
            mesas={mesas}
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
          <Button
            onClick={() => {
              handlePrint && handlePrint();
              handleRealizarPedido();
              setIsOpen(false);
            }}
          >
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
