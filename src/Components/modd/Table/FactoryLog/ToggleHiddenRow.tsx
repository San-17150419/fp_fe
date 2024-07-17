import React, { useState } from "react";

type HiddenRowsToggleProps = {
  hiddenRows: string[];
  setHiddenRows?: React.Dispatch<
    React.SetStateAction<{ label: string; visible: boolean }[]>
  >;
  allHiddenToggled?: boolean;
  setAllHiddenToggled?: React.Dispatch<React.SetStateAction<boolean>>;
};

// type HiddenRowsToggleProps = {
//   hiddenRows?: { label: string; visible: boolean }[];
//   setHiddenRows?: React.Dispatch<
//     React.SetStateAction<{ label: string; visible: boolean }[]>
//   >;
//   allHiddenToggled?: boolean;
//   setAllHiddenToggled?: React.Dispatch<React.SetStateAction<boolean>>;
// };

const HiddenRowsToggle = ({
  hiddenRows,
  setHiddenRows,
  allHiddenToggled,
  setAllHiddenToggled,
}: HiddenRowsToggleProps) => {
  //   const toggleAll = () => {
  //     setAllHiddenToggled(!allHiddenToggled);
  //     setHiddenRows(
  //       hiddenRows.map((row: any) => ({ ...row, visible: !allHiddenToggled })),
  //     );
  //   };

  //   const toggleRow = (index: number) => {
  //     const newHiddenRows = [...hiddenRows];
  //     newHiddenRows[index].visible = !newHiddenRows[index].visible;
  //     setHiddenRows(newHiddenRows);
  //   };

  return (
    <div>
      <div className="flex text-xs desktop:text-sm">
        <input
          type="checkbox"
          checked={allHiddenToggled}
          id="toggle-all"
          className="mr-2"
          //   onChange={toggleAll}
        />
        <label htmlFor="toggle-all">Toggle All Hidden Rows</label>
      </div>
      {hiddenRows.map((text: string, index: number) => (
        <div key={index} className="flex text-xs desktop:text-sm">
          <input
            type="checkbox"
            className="mr-2"
            // onChange={() => toggleRow(index)}
          />
          {text}
        </div>
      ))}
      {/* {hiddenRows.map((row: any, index: number) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={row.visible}
            // onChange={() => toggleRow(index)}
          />
          {row.label}
        </div>
      ))} */}
    </div>
  );
};

export default HiddenRowsToggle;
