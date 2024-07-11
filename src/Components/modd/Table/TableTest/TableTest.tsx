import React from "react";
import Modal from "../../Modal/NonDialogModal";
import StatusComponent from "../FactoryLog/StatusComponent";

const TableTest: React.FC<{ children: React.ReactNode }> & {
  TableHeader: typeof TableHeader;
  TableBody: typeof TableBody;
  TableRow: typeof TableRow;
  TableCell: typeof TableCell;
} = ({ children }) => {
  return (
    <table className="relative w-full table-auto border-separate border-spacing-0 align-middle">
      {children}
    </table>
  );
};

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <thead className="sticky top-0 bg-gray-300">{children}</thead>;
};

const TableBody: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const TableRow: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <tr className="border border-gray-400 p-2">{children}</tr>;
};

const TableCell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <td className="border border-gray-400 p-2 text-center font-semibold">
      {children}
    </td>
  );
};

TableTest.TableHeader = TableHeader;
TableTest.TableBody = TableBody;
TableTest.TableRow = TableRow;
TableTest.TableCell = TableCell;

export default TableTest;
