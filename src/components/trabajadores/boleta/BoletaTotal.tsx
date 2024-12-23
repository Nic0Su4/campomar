'use client';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import CampomarReceipt from '@/components/trabajadores/boleta/Boleta';

export default function BoletaTotal({ pedido }: { pedido: any }) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Boleta-Pedido-${pedido.PedidoID}`,
  });

  return (
    <div>
      <div style={{ display: 'none' }}>
        <CampomarReceipt ref={receiptRef} pedido={pedido} />
      </div>
      <button onClick={handlePrint} className="hidden">
        Imprimir
      </button>
    </div>
  );
}
