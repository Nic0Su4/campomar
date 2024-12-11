"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "../ui/spinner";
import { fetchEarnings, fetchTopSellingDishes } from "@/utils/dashboardUtils";

export const DashboardSummary = () => {
  const [earnings, setEarnings] = useState<number>(0);
  const [topDishes, setTopDishes] = useState<
    { dish: string; totalSold: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  // New state to track which predefined range is selected
  const [selectedPredefinedRange, setSelectedPredefinedRange] = useState<
    number | null
  >(null);

  // New state for custom date selection
  const [customDateMode, setCustomDateMode] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    setLoading(true);
    try {
      const earningsData = await fetchEarnings(
        dateRange.startDate,
        dateRange.endDate
      );
      const topDishesData = await fetchTopSellingDishes(
        dateRange.startDate,
        dateRange.endDate
      );

      setEarnings(earningsData);
      setTopDishes(topDishesData);
    } catch (error) {
      console.error("Error al cargar los datos del dashboard", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchData();
    }
  }, [fetchData, dateRange]);

  const setPredefinedRange = (days: number) => {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    setDateRange({
      startDate: startDate.toISOString().split("T")[0],
      endDate,
    });

    // Reset custom date mode and set selected predefined range
    setCustomDateMode(false);
    setSelectedPredefinedRange(days);
  };

  const setFullYearRange = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const endDate = currentDate;

    setDateRange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });

    // Reset custom date mode and set selected predefined range
    setCustomDateMode(false);
    setSelectedPredefinedRange(365);
  };

  const handleDateChange = (key: "startDate" | "endDate", value: string) => {
    setDateRange((prev) => {
      const updatedRange = { ...prev, [key]: value };
      return updatedRange;
    });
  };

  const handleCustomSearch = () => {
    // Only proceed if both dates are selected and start date is before end date
    if (
      dateRange.startDate &&
      dateRange.endDate &&
      new Date(dateRange.startDate) <= new Date(dateRange.endDate)
    ) {
      // Reset predefined range selection
      setSelectedPredefinedRange(null);
      fetchData();
    }
  };

  return (
    <TabsContent value="dashboard-summary">
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <Label>Rango de Fechas</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setPredefinedRange(1)}
                  variant={
                    selectedPredefinedRange === 1 ? "default" : "outline"
                  }
                >
                  Hoy
                </Button>
                <Button
                  onClick={() => setPredefinedRange(7)}
                  variant={
                    selectedPredefinedRange === 7 ? "default" : "outline"
                  }
                >
                  Últimos 7 días
                </Button>
                <Button
                  onClick={() => setPredefinedRange(30)}
                  variant={
                    selectedPredefinedRange === 30 ? "default" : "outline"
                  }
                >
                  Últimos 30 días
                </Button>
                <Button
                  onClick={setFullYearRange}
                  variant={
                    selectedPredefinedRange === 365 ? "default" : "outline"
                  }
                >
                  De todo el año
                </Button>
              </div>
            </div>
            <div>
              <Label>Personalizado</Label>
              <div className="flex gap-2 items-end">
                <div>
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate || ""}
                    onChange={(e) => {
                      handleDateChange("startDate", e.target.value);
                      setCustomDateMode(true);
                      setSelectedPredefinedRange(null);
                    }}
                    max={dateRange.endDate || undefined}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate || ""}
                    onChange={(e) => {
                      handleDateChange("endDate", e.target.value);
                      setCustomDateMode(true);
                      setSelectedPredefinedRange(null);
                    }}
                    min={dateRange.startDate || undefined}
                  />
                </div>
                <Button
                  onClick={handleCustomSearch}
                  disabled={!dateRange.startDate || !dateRange.endDate}
                  variant={customDateMode ? "default" : "outline"}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <Label>Ganancias Totales</Label>
            {loading ? (
              <Spinner />
            ) : (
              <p className="text-xl font-semibold">
                S/. {Number(earnings).toFixed(2)}
              </p>
            )}
          </div>
          <div>
            <Label>Platos Más Vendidos</Label>
            {loading ? (
              <Spinner />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plato</TableHead>
                    <TableHead>Total Vendido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topDishes.map((dish, index) => (
                    <TableRow key={index}>
                      <TableCell>{dish.dish}</TableCell>
                      <TableCell>{dish.totalSold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
