"use client";

import { forwardRef } from "react";

interface BoletaCocinaProps {
  orderItems: {
    PlatoID: number;
    Descripcion: string;
    Cantidad: number;
  }[];
  mesas: {
    NumeroMesa: number;
  }[];
}

const BoletaCocina = forwardRef<HTMLDivElement, BoletaCocinaProps>(
  ({ orderItems, mesas }, ref) => {
    return (
      <div ref={ref} className="p-4 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">Boleta para Cocina</h2>
        <p>
          <strong>Mesa(s):</strong>{" "}
          {mesas.map((mesa) => mesa.NumeroMesa).join(", ")}
        </p>
        <ul className="mt-4">
          {orderItems.map((item) => (
            <li
              key={item.PlatoID}
              className="flex justify-between border-b py-2"
            >
              <span>{item.Descripcion}</span>
              <span>{item.Cantidad}x</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

BoletaCocina.displayName = "BoletaCocina";

export default BoletaCocina;
