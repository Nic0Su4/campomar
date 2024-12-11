import { TableHead, TableRow } from "@/components/ui/table";

const OrderTableHeader = () => {
  return (
    <TableRow>
      <TableHead>ID</TableHead>
      <TableHead>Mesa(s)</TableHead>
      <TableHead>Platos</TableHead>
      <TableHead>Total</TableHead>
      <TableHead>Fecha</TableHead>
      <TableHead>Acciones</TableHead>
    </TableRow>
  );
};

export default OrderTableHeader;
