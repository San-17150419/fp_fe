import React from "react";
import cn from "../../../../util/cn";

const Table: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> & {
  TableHeader: typeof TableHeader;
  TableBody: typeof TableBody;
  TableRow: typeof TableRow;
  TableCell: typeof TableCell;
  TableCaption: typeof TableCaption;
} = ({ children, className, id }) => {
  return (
    <table
      id={id}
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
    <thead className={cn("bg-gray-300", className, sticky && "sticky top-0")}>
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
  return <tr className={cn("p-2", className)}>{children}</tr>;
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
      className={cn("p-2 text-center", className)}
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
