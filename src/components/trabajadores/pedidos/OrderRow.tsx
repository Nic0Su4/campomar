import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrderRow = ({
  order,
  onFinishOrder,
  onViewOrder,
  onTipoPagoChange,
  tipoPago,
}: {
  order: {
    id: string;
    table: string;
    items: number;
    total: number;
    time: string;
    date: string;
  };
  onFinishOrder: () => void;
  onViewOrder: () => void;
  onTipoPagoChange: (value: number | null) => void;
  tipoPago: number | null;
}) => {
  const getButtonColor = (tipoPago: number | null) => {
    switch (tipoPago) {
      case 1: return 'bg-[#00631b] hover:bg-[#00631b]/90';
      case 2: return 'bg-[#931194] hover:bg-[#931194]/90';
      case 3: return 'bg-[#f7762c] hover:bg-[#f7762c]/90';
      default: return '';
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{order.id}</TableCell>
      <TableCell>{order.table}</TableCell>
      <TableCell>{order.items}</TableCell>
      <TableCell className="text-right">S/. {Number(order.total).toFixed(2)}</TableCell>
      <TableCell className="hidden md:table-cell">{`${order.date} ${order.time}`}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end items-center space-x-2">
          <Button size="sm" variant="outline" onClick={onViewOrder}>
            <Eye className="w-4 h-4" />
            <span className="sr-only">Ver</span>
          </Button>
          <Select onValueChange={(value) => onTipoPagoChange(Number(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Efectivo</SelectItem>
              <SelectItem value="2">Yape</SelectItem>
              <SelectItem value="3">POS</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className={`${getButtonColor(tipoPago)}`}
            onClick={onFinishOrder}
            disabled={tipoPago === null}
          >
            <Check className="w-4 h-4" />
            <span className="sr-only">Finalizar</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;

