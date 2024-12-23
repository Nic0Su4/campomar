"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import CampomarReceipt from "@/components/trabajadores/boleta/Boleta";

export default function BoletaTotal({ pedidoID }: { pedidoID: string }) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Boleta-Pedido-${pedidoID}`,
  });

  return (
    <div>
      <div style={{ display: "none" }}>
        <CampomarReceipt ref={receiptRef} pedidoID={pedidoID} />
      </div>
      <button onClick={() => handlePrint} className="hidden">
        Imprimir
      </button>
    </div>
  );
}
