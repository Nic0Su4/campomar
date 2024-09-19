import { platos } from "@prisma/client";
import React from "react";

const CartaPage = async () => {
  const platos: platos[] = await fetch("http://localhost:3000/api/platos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Error al obtener los platos");
    }

    return response.json();
  });

  return (
    <div>
      <h1>Carta</h1>
      <ul>
        {platos.map((plato) => (
          <li key={plato.PlatoID}>
            {plato.Descripcion + " - " + plato.Precio}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartaPage;
