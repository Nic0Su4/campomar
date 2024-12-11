"use client";

import React, { useEffect, useState } from "react";
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
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { empleados } from "@prisma/client";
import { Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const GestionEmpleados = () => {
  const [employees, setEmployees] = useState<empleados[]>([]);

  const [newEmployee, setNewEmployee] = useState<empleados>({
    EmpleadoID: 0,
    Nombre: "",
    TipoEmpleadoID: 0,
    DNI: "",
    Password: "",
  });
  const [editingEmployee, setEditingEmployee] = useState<empleados | null>(
    null
  );
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/empleados", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Error al obtener los empleados");
        }

        const empleados = await response.json();
        setEmployees(empleados);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployees();
  }, []);

  // Función para añadir un nuevo empleado
  const handleAddEmployee = async () => {
    if (
      newEmployee.DNI &&
      newEmployee.Nombre &&
      newEmployee.Password &&
      newEmployee.TipoEmpleadoID
    ) {
      setLoadingEmployees(true);
      try {
        const response = await fetch("/api/empleados", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DNI: newEmployee.DNI,
            Nombre: newEmployee.Nombre,
            Password: newEmployee.Password,
            TipoEmpleadoID: newEmployee.TipoEmpleadoID,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al agregar el empleado");
        }

        const empleado = await response.json();

        // Actualiza la lista de mesas con la mesa recién creada
        setEmployees([...employees, empleado]);

        // Resetea el formulario de nueva mesa
        setNewEmployee({
          EmpleadoID: 0,
          Nombre: "",
          TipoEmpleadoID: 0,
          DNI: "",
          Password: "",
        });
      } catch (error) {
        console.error(error);
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        setLoadingEmployees(false);
      }
    } else {
      alert("Por favor, rellena todos los campos");
    }
  };

  const handleEditEmployee = async () => {
    if (
      editingEmployee?.DNI &&
      editingEmployee.Nombre &&
      editingEmployee.Password &&
      editingEmployee.TipoEmpleadoID
    ) {
      setLoadingEmployees(true);

      try {
        const response = await fetch(
          `/api/empleados/${editingEmployee.EmpleadoID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              DNI: editingEmployee.DNI,
              Nombre: editingEmployee.Nombre,
              Password: editingEmployee.Password,
              TipoEmpleadoID: editingEmployee.TipoEmpleadoID,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar el empleado");
        }

        const updatedEmpleado = await response.json();

        setEmployees((prevEmployees) =>
          prevEmployees.map((empleado) =>
            empleado.EmpleadoID === updatedEmpleado.EmpleadoID
              ? updatedEmpleado
              : empleado
          )
        );

        // Limpiar el formulario de edición
        setEditingEmployee(null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingEmployees(false);
      }
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      const response = await fetch(`/api/empleados/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el empleado");
      }

      // Eliminar la mesa del estado local
      setEmployees(employees.filter((employee) => employee.EmpleadoID !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const selectEmployeeForEdit = (employee: empleados) => {
    setEditingEmployee(employee);
  };

  return (
    <TabsContent value="employees">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-8 mb-6">
            <div className="flex-1">
              <Label htmlFor="employeeName">
                {editingEmployee ? "Editar Nombre" : "Nombre Empleado"}
              </Label>
              <Input
                required
                id="employeeName"
                value={
                  editingEmployee
                    ? editingEmployee.Nombre!
                    : newEmployee.Nombre!
                }
                onChange={(e) =>
                  editingEmployee
                    ? setEditingEmployee({
                        ...editingEmployee,
                        Nombre: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        Nombre: e.target.value,
                      })
                }
                placeholder="Nombre del Empleado"
                type="text"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="employeeRole">Tipo de Empleado</Label>
              <Select
                required
                value={
                  editingEmployee
                    ? editingEmployee.TipoEmpleadoID?.toString()
                    : newEmployee.TipoEmpleadoID?.toString()
                }
                onValueChange={(value) => {
                  editingEmployee
                    ? setEditingEmployee({
                        ...editingEmployee,
                        TipoEmpleadoID: Number(value),
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        TipoEmpleadoID: Number(value),
                      });
                }}
              >
                <SelectTrigger id="employeeRole">
                  <SelectValue placeholder="Tipo de Empleado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Mesero</SelectItem>
                  <SelectItem value="2">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="employeeDNI">
                {editingEmployee ? "Editar DNI" : "DNI"}
              </Label>
              <Input
                required
                id="employeeDNI"
                value={
                  editingEmployee ? editingEmployee.DNI! : newEmployee.DNI!
                }
                onChange={(e) =>
                  editingEmployee
                    ? setEditingEmployee({
                        ...editingEmployee,
                        DNI: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        DNI: e.target.value,
                      })
                }
                placeholder="DNI"
                type="text"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="employeePassword">
                {editingEmployee ? "Editar Contraseña" : "Contraseña"}
              </Label>
              <Input
                required
                id="employeePassword"
                value={
                  editingEmployee
                    ? editingEmployee.Password!
                    : newEmployee.Password!
                }
                onChange={(e) =>
                  editingEmployee
                    ? setEditingEmployee({
                        ...editingEmployee,
                        Password: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        Password: e.target.value,
                      })
                }
                placeholder="Contraseña"
                type="text"
              />
            </div>
            <Button
              onClick={editingEmployee ? handleEditEmployee : handleAddEmployee}
              className="mt-auto"
              disabled={loadingEmployees}
            >
              {loadingEmployees ? (
                <>
                  <Spinner /> {editingEmployee ? "Guardando..." : "Cargando..."}
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {editingEmployee ? "Guardar Cambios" : "Añadir Empleado"}
                </>
              )}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.EmpleadoID}>
                  <TableCell>{employee.Nombre}</TableCell>
                  <TableCell>
                    {employee.TipoEmpleadoID == 1 ? "Mesero" : "Admin"}
                  </TableCell>
                  <TableCell>{employee.DNI}</TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => selectEmployeeForEdit(employee)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.EmpleadoID)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
