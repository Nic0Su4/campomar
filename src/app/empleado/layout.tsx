import EmpleadoLayoutWrapper from "@/components/trabajadores/EmpleadoLayout";
import { Logout } from "@/components/trabajadores/Logout";
import { Reloj } from "@/components/trabajadores/Reloj";
import Sesion from "@/components/trabajadores/Sesion";

interface EmpleadoLayoutProps {
  children: React.ReactNode;
}

const EmpleadoLayout = ({ children }: EmpleadoLayoutProps) => {
  return (
    <EmpleadoLayoutWrapper>
      <header>
        <Reloj />
      </header>
      <div className="w-full h-full flex justify-center">{children}</div>
      <footer className="flex justify-between w-full bg-black text-white py-4 px-12 items-center">
        <Logout />
        <Sesion />
      </footer>
    </EmpleadoLayoutWrapper>
  );
};

export default EmpleadoLayout;
