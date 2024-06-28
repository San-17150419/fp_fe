import { useEffect, useState } from "react";
import Input from "./Input";
import NonDialogModal from "./NonDialogModal";
import Select from "./Select/Select";
type DataTableProps = {
  children?: React.ReactNode;
  height: string;
  width: string;
};

function DataTable() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="h-[700px] w-[250px] overflow-hidden rounded-lg border border-gray-300 shadow-lg md:w-full">
      <div className="h-full overflow-auto">
        <table className="relative w-full border-collapse">
          <thead className="sticky top-0 bg-gray-300">
            <tr>
              <th key="header-0" className="border border-gray-400 p-2">
                #
              </th>
              {Array.from({ length: 17 }).map((_, index) => (
                <th
                  className="border border-gray-400 p-2 text-center"
                  key={`header-${index + 1}`}
                >
                  Table heading (unit)
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2 hover:bg-gray-500">
                1
              </td>
              <td
                key="row-0-col-0"
                className={`border border-gray-400 p-2 text-center hover:bg-gray-500 ${showModal ? "bg-gray-500" : ""}`}
              >
                <button onClick={() => setShowModal(true)}>Open Modal</button>
                {showModal && (
                  <NonDialogModal
                    title="Modal Title"
                    onClose={() => setShowModal(false)}
                    openModal={true}
                  >
                    <div className="grid flex-grow grid-cols-2 gap-y-4">
                      <Input
                        type="email"
                        autoComplete="off"
                        name="email"
                        placeholder="email"
                      />
                      <Input
                        type="password"
                        required
                        name="password"
                        placeholder="password"
                      />
                      <Input name="請輸入文字" placeholder="請輸入文字" />
                      <Select options={["1", "2", "3"]} />
                      <Select
                        options={[
                          { id: 1, value: "Durward Reynolds" },
                          { id: 2, value: "Kenton Towne" },
                          { id: 3, value: "Therese Wunsch" },
                          { id: 4, value: "Benedict Kessler" },
                          { id: 5, value: "Katelyn Rohan" },
                        ]}
                      />
                      <Select
                        options={[
                          { id: 5, value: "Durward Reynolds" },
                          { id: 6, value: "Kenton Towne" },
                          { id: 7, value: "Therese Wunsch" },
                          { id: 8, value: "Benedict Kessler" },
                          { id: 9, value: "Katelyn Rohan" },
                        ]}
                      />
                      <Select
                        options={[
                          "全部系列",
                          "P系列",
                          "PA系列",
                          "PC系列",
                          "CE系列",
                          "特殊系列",
                          "雙色系列",
                          "配件",
                          "臨時模具",
                        ]}
                      />
                    </div>
                  </NonDialogModal>
                )}
              </td>
              {Array.from({ length: 16 }).map((_, index) => (
                <td
                  key={`row-0-col-${index + 1}`}
                  className="border border-gray-400 p-2 text-center hover:bg-gray-400"
                >
                  Table cell {index + 1}
                </td>
              ))}
            </tr>
            {Array.from({ length: 30 }).map((_, rowIndex) => (
              <tr key={`row-${rowIndex + 1}`}>
                <td className="border border-gray-400 p-2 hover:bg-gray-500">
                  {rowIndex + 2}
                </td>
                {Array.from({ length: 17 }).map((_, colIndex) => (
                  <td
                    key={`row-${rowIndex + 1}-col-${colIndex + 1}`}
                    className="border border-gray-400 p-2 text-center hover:bg-gray-400"
                  >
                    Table cell {colIndex + 1}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
