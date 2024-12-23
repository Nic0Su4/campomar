import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GestionMesas } from "@/components/administrador/GestionMesas";
import { GestionEmpleados } from "@/components/administrador/GestionEmpleados";
import { GestionPlatos } from "@/components/administrador/GestionPlatos";
import { DashboardSummary } from "@/components/administrador/AdminDashboard";
import { AdminHeader } from "@/components/administrador/AdminHeader";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="tables" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            <TabsTrigger 
              value="tables" 
              className="bg-white shadow-sm hover:bg-gray-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Mesas
            </TabsTrigger>
            <TabsTrigger
              value="dishes" 
              className="bg-white shadow-sm hover:bg-gray-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Platos
            </TabsTrigger>
            <TabsTrigger 
              value="employees" 
              className="bg-white shadow-sm hover:bg-gray-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Empleados
            </TabsTrigger>
            <TabsTrigger 
              value="dashboard-summary" 
              className="bg-white shadow-sm hover:bg-gray-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Dashboard
            </TabsTrigger>
          </TabsList>

          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <TabsContent value="tables">
              <GestionMesas />
            </TabsContent>

            <TabsContent value="dishes">
              <GestionPlatos />
            </TabsContent>

            <TabsContent value="employees">
              <GestionEmpleados />
            </TabsContent>

            <TabsContent value="dashboard-summary">
              <DashboardSummary />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

