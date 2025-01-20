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
import { Check } from "lucide-react";

export default function BoletaTotal({
  pedidoID,
  onFinishOrder,
  buttonColor,
  tipoPago,
}: {
  pedidoID: string;
  onFinishOrder: () => void;
  buttonColor: string;
  tipoPago: number | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isPrinted, setIsPrinted] = useState(false);

  // Configuración de la función de impresión
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Boleta-Pedido-${pedidoID}`,
    onAfterPrint: () => setIsPrinted(true),
  });

  const handleConfirmPrint = () => {
    if (isPrinted) {
      onFinishOrder();
      setIsOpen(false);
      setIsPrinted(false);
    } else {
      alert("Primero debe imprimir la boleta antes de confirmar el pedido.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={buttonColor} disabled={tipoPago === null}>
          <Check className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Boleta del Pedido {pedidoID}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[80vh] overflow-y-auto">
          {/* Referencia al contenido de la boleta */}
          <CampomarReceipt
            ref={receiptRef}
            pedidoID={pedidoID}
            tipoPago={tipoPago}
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
          {/* Llamada directa a la función handlePrint */}
          <Button
            onClick={() => {
              handlePrint();
            }}
          >
            Imprimir
          </Button>
          <Button
            onClick={handleConfirmPrint}
            variant="default"
            disabled={!isPrinted}
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
