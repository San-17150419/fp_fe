import React from "react";
import Modal from "../../Modal/NonDialogModal";
import cn from "../../../../util/cn";

const Table: React.FC<{ children: React.ReactNode; className?: string }> & {
  TableHeader: typeof TableHeader;
  TableBody: typeof TableBody;
  TableRow: typeof TableRow;
  TableCell: typeof TableCell;
  TableCaption: typeof TableCaption;
} = ({ children, className }) => {
  return (
    <table
      className={cn(
        "relative w-full table-auto border-separate border-spacing-0 text-nowrap align-middle",
        className,
      )}
    >
      {children}
    </table>
  );
};

const TableHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}> = ({ children, className, sticky = false }) => {
  return (
    <thead
      className={cn("bg-gray-300 text-xs", className, sticky && "sticky top-0")}
    >
      {children}
    </thead>
  );
};

const TableBody: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};
const TableRow: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <tr className={cn("p-2 text-xs hover:bg-gray-500", className)}>
      {children}
    </tr>
  );
};

const TableCell: React.FC<{
  children?: React.ReactNode;
  className?: string;
  colspan?: number;
  rowspan?: number;
}> = ({ children, className, colspan, rowspan }) => {
  return (
    <td
      colSpan={colspan || 1}
      rowSpan={rowspan || 1}
      className={cn("p-2 text-center text-xs font-semibold", className)}
    >
      {children}
    </td>
  );
};

const TableCaption: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <caption className={className}>{children}</caption>;
};

Table.TableCaption = TableCaption;
Table.TableHeader = TableHeader;
Table.TableBody = TableBody;
Table.TableRow = TableRow;
Table.TableCell = TableCell;

export default Table;
