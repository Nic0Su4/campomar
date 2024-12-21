"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import {
  fetchEarnings,
  fetchTopSellingDishes,
  fetchSalesByEmployee,
} from "@/utils/dashboardUtils";
import { motion } from "framer-motion";

export const DashboardSummary = () => {
  const [earnings, setEarnings] = useState<number>(0);
  const [earningsByPaymentType, setEarningsByPaymentType] = useState<{
    efectivo: number;
    yape: number;
    pos: number;
  }>({ efectivo: 0, yape: 0, pos: 0 });
  const [topDishes, setTopDishes] = useState<
    { dish: string; totalSold: number }[]
  >([]);
  const [salesByEmployee, setSalesByEmployee] = useState<
    { empleado: string; totalSold: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const [selectedPredefinedRange, setSelectedPredefinedRange] = useState<
    number | null
  >(null);
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
      const salesByEmployeeData = await fetchSalesByEmployee(
        dateRange.startDate,
        dateRange.endDate
      );

      setEarnings(earningsData.earnings);
      setEarningsByPaymentType(earningsData.earningsByPaymentType);
      setTopDishes(topDishesData);
      setSalesByEmployee(salesByEmployeeData);
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

    setCustomDateMode(false);
    setSelectedPredefinedRange(365);
  };

  const handleDateChange = (key: "startDate" | "endDate", value: string) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
  };

  const handleCustomSearch = () => {
    if (
      dateRange.startDate &&
      dateRange.endDate &&
      new Date(dateRange.startDate) <= new Date(dateRange.endDate)
    ) {
      setSelectedPredefinedRange(null);
      fetchData();
    }
  };

  return (
    <TabsContent value="dashboard-summary">
      <Card className="border-t-2 border-[#00631b]">
        <CardHeader>
          <CardTitle className="text-gray-800 border-b-2 border-[#00631b] inline-block pb-1">Resumen del Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <Label className="text-gray-600 font-medium">Rango de Fechas</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { days: 1, label: "Hoy" },
                  { days: 7, label: "Últimos 7 días" },
                  { days: 30, label: "Últimos 30 días" },
                  { days: 365, label: "De todo el año" },
                ].map(({ days, label }) => (
                  <Button
                    key={days}
                    onClick={() => days === 365 ? setFullYearRange() : setPredefinedRange(days)}
                    variant={selectedPredefinedRange === days ? "default" : "outline"}
                    className={selectedPredefinedRange === days ? "bg-[#00631b] text-white hover:bg-[#00631b]/90" : "hover:border-[#00631b]"}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-gray-600 font-medium">Personalizado</Label>
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
                    className="border-gray-300 focus:ring-gray-400 focus:border-gray-400"
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
                    className="border-gray-300 focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
                <Button
                  onClick={handleCustomSearch}
                  disabled={!dateRange.startDate || !dateRange.endDate}
                  variant={customDateMode ? "default" : "outline"}
                  className={customDateMode ? "bg-gray-800 hover:bg-gray-700" : "hover:bg-gray-100"}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>

          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Label className="text-gray-700 font-medium border-l-4 border-[#00631b] pl-2">Ganancias Totales</Label>
            {loading ? (
              <Spinner className="text-gray-600" />
            ) : (
              <p className="text-3xl font-bold text-[#00631b]">
                S/. {Number(earnings).toFixed(2)}
              </p>
            )}
          </motion.div>

          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Label className="text-gray-700 font-medium border-l-4 border-[#00631b] pl-2">Ganancias por Tipo de Pago</Label>
            {loading ? (
              <Spinner className="text-gray-600" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600 border-b-2 border-[#00631b]">Tipo de Pago</TableHead>
                    <TableHead className="text-gray-600 border-b-2 border-[#00631b]">Ganancias</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(earningsByPaymentType).map(([type, amount]) => (
                    <TableRow key={type} className="hover:bg-[#00631b]/5 transition-colors">
                      <TableCell>{type.charAt(0).toUpperCase() + type.slice(1)}</TableCell>
                      <TableCell>S/. {amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </motion.div>

          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Label className="text-gray-700 font-medium border-l-4 border-[#00631b] pl-2">Platos más vendidos</Label>
            {loading ? (
              <Spinner className="text-gray-600" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600 border-b-2 border-[#00631b]">Plato</TableHead>
                    <TableHead className="text-gray-600 border-b-2 border-[#00631b]">Total Vendido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topDishes.map((dish, index) => (
                    <TableRow key={index} className="hover:bg-[#00631b]/5 transition-colors">
                      <TableCell>{dish.dish}</TableCell>
                      <TableCell>{dish.totalSold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </motion.div>

          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Label className="text-gray-700 font-medium border-l-4 border-[#00631b] pl-2">Ventas por Empleado</Label>
            {loading ? (
              <Spinner className="text-gray-600" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600 border-b-2 border-[#00631b]">Empleado</TableHead>
                    <TableHead className="text-gray-600 border-b-2 border-[#00631b]">Total Vendido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesByEmployee.map((employee, index) => (
                    <TableRow key={index} className="hover:bg-[#00631b]/5 transition-colors">
                      <TableCell>{employee.empleado}</TableCell>
                      <TableCell>S/. {employee.totalSold.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

