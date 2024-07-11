import React from "react";
import Modal from "../../Modal/NonDialogModal";
import cn from "../../../../util/cn";

const TableTest: React.FC<{ children: React.ReactNode }> & {
  TableHeader: typeof TableHeader;
  TableBody: typeof TableBody;
  TableRow: typeof TableRow;
  TableCell: typeof TableCell;
} = ({ children }) => {
  return (
    <table className="relative w-full table-auto border-separate border-spacing-0 text-nowrap align-middle">
      {children}
    </table>
  );
};

const TableHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <thead className={cn("sticky top-0 bg-gray-300", className)}>
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
  return <tr className={cn("p-2 hover:bg-gray-500", className)}>{children}</tr>;
};

const TableCell: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <td
      className={cn(
        "border border-gray-400 p-2 text-center font-semibold",
        className,
      )}
    >
      {children}
    </td>
  );
};

TableTest.TableHeader = TableHeader;
TableTest.TableBody = TableBody;
TableTest.TableRow = TableRow;
TableTest.TableCell = TableCell;

export default TableTest;
