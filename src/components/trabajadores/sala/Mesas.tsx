'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { mesas } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const Mesas = () => {
  const router = useRouter()
  const [mesas, setMesas] = useState<mesas[]>([])
  const [selectedTables, setSelectedTables] = useState<mesas[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const response = await fetch("/api/mesas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener las mesas")
        }

        const data = await response.json()
        setMesas(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchMesas()
  }, [])

  const handleSelectTable = (table: mesas) => {
    setSelectedTables((prev: any) =>
      prev.includes(table)
        ? prev.filter((t: mesas) => t.MesaID !== table.MesaID)
        : [...prev, table]
    )
  }

  const handleGoToTable = () => {
    setIsLoading(true)

    if (selectedTables.length === 0) {
      setIsLoading(false)
      return
    }

    if (selectedTables.some((table) => table.Estado === "Ocupada")) {
      alert("Al menos una mesa seleccionada está ocupada")
      setIsLoading(false)
      return
    }

    const selectedTablesQuery = selectedTables
      .map((table) => table.MesaID)
      .join(",")

    router.push(`/empleado/sala/mesa?mesas=${selectedTablesQuery}`)
  }

  const handleOccupiedTable = async (mesa: mesas) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/mesas/relacion?mesaId=${mesa.MesaID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        alert("Error al obtener la mesa")
        setIsLoading(false)
        return
      }

      const data = await response.json()

      const mesasRelacionadas = data.map(
        (mesa: mesas) => mesa.MesaID
      )

      router.push(
        `/empleado/sala/mesa?mesas=${mesasRelacionadas.join(
          ","
        )}`
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="bg-white border-b">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Sala del Restaurante
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {mesas.map((mesa) => (
            <Button
              key={mesa.MesaID}
              onClick={
                mesa.Estado == "Libre"
                  ? () => handleSelectTable(mesa)
                  : () => handleOccupiedTable(mesa)
              }
              variant={selectedTables.includes(mesa) ? "default" : "outline"}
              className={`
                h-16 w-full text-base font-medium rounded transition-colors duration-200
                ${
                  selectedTables.includes(mesa)
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }
                ${
                  mesa.Estado === "Ocupada"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : ""
                }
              `}
            >
              {isLoading ? (
                <Spinner size="small" className="text-current" />
              ) : (
                `Mesa ${mesa.NumeroMesa}`
              )}
            </Button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">Mesas seleccionadas:</span>
            {selectedTables.map((table) => (
              <Badge key={table.MesaID} variant="outline" className="text-sm py-1 px-2 bg-gray-100">
                {table.NumeroMesa}
              </Badge>
            ))}
          </div>
          <Button
            onClick={handleGoToTable}
            disabled={selectedTables.length === 0 || isLoading}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Spinner size="small" className="mr-2 text-white" />
                Cargando...
              </>
            ) : (
              "Ir a la Carta"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

