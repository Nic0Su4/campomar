"use client";

import { useEmpleadoStore } from "@/store/empleado";
import { empleados } from "@prisma/client";
import { User, Settings, HelpCircle } from 'lucide-react';
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sesion = () => {
  const empleado: empleados = useEmpleadoStore((state: any) => state.empleado);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-black hover:text-[#00631b] relative h-12 w-12 rounded-full">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{empleado.Nombre ? empleado.Nombre.charAt(0) : ''}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{empleado.Nombre}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link 
            href="/empleado/perfil" 
            className="flex items-center w-full text-black hover:text-[#00631b] transition-colors duration-200"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="flex items-center w-full text-black hover:text-[#00631b] transition-colors duration-200">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="flex items-center w-full text-black hover:text-[#00631b] transition-colors duration-200">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ayuda</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Sesion;

