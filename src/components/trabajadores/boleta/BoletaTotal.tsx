"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import CampomarReceipt from "@/components/trabajadores/boleta/Boleta";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BoletaTotal({ pedidoID }: { pedidoID: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Configuración de la función de impresión
  const handlePrint = useReactToPrint({
    print: () => receiptRef.print(),
    documentTitle: `Boleta-Pedido-${pedidoID}`,
    onAfterPrint: () => console.log("Impresión completada."),
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ver Boleta</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Boleta del Pedido {pedidoID}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[80vh] overflow-y-auto">
          {/* Referencia al contenido de la boleta */}
          <CampomarReceipt ref={receiptRef} pedidoID={pedidoID} />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
          {/* Llamada directa a la función handlePrint */}
          <Button onClick={() => handlePrint && handlePrint()}>Imprimir</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
