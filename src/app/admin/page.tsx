import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GestionMesas } from "@/components/administrador/GestionMesas";
import { GestionEmpleados } from "@/components/administrador/GestionEmpleados";
import { GestionPlatos } from "@/components/administrador/GestionPlatos";
import { DashboardSummary } from "@/components/administrador/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tables">Mesas</TabsTrigger>
          <TabsTrigger value="dishes">Platos</TabsTrigger>
          <TabsTrigger value="employees">Empleados</TabsTrigger>
          <TabsTrigger value="dashboard-summary">Dashboard</TabsTrigger>
        </TabsList>

        {/* Gestión de Mesas */}
        <GestionMesas />

        {/* Gestión de Platos */}
        <GestionPlatos />

        {/* Gestión de Empleados */}
        <GestionEmpleados />

        {/* Resumen del Dashboard */}
        <DashboardSummary />
      </Tabs>
    </div>
  );
}
