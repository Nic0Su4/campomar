import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check, Table } from "lucide-react";
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
  return (
    <TableRow>
      <TableCell>{order.id}</TableCell>
      <TableCell>{order.table}</TableCell>
      <TableCell>{order.items}</TableCell>
      <TableCell>S/. {Number(order.total).toFixed(2)}</TableCell>
      <TableCell>{`${order.date} a las ${order.time}`}</TableCell>
      <TableCell className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={onViewOrder}>
          <Eye className="w-4 h-4 mr-2" />
          Ver
        </Button>
        <Select onValueChange={(value) => onTipoPagoChange(Number(value))}>
          <SelectTrigger>
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
          variant="destructive"
          onClick={onFinishOrder}
          disabled={tipoPago === null}
        >
          <Check className="w-4 h-4 mr-2" />
          Finalizar
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;
