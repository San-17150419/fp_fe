import React, { useState } from "react";

type HiddenRowsToggleProps = {
  hiddenRows: { label: string; visible: boolean }[];
  setHiddenRows: React.Dispatch<React.SetStateAction<string[]>>;
  setRows: React.Dispatch<
    React.SetStateAction<{ label: string; visible: boolean }[]>
  >;
  allHiddenToggled: boolean;
  setAllHiddenToggled: React.Dispatch<React.SetStateAction<boolean>>;
};

const HiddenRowsToggle = ({
  hiddenRows,
  setHiddenRows,
  setRows,
  allHiddenToggled,
  setAllHiddenToggled,
}: HiddenRowsToggleProps) => {
  const toggleVisibility = (label: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.label === label ? { ...row, visible: !row.visible } : row,
      ),
    );
  };

  const toggleAllVisibility = () => {
    setAllHiddenToggled((prev) => !prev);
    setRows((prevRows) =>
      prevRows.map((row) => ({ ...row, visible: !allHiddenToggled })),
    );
  };

  return (
    <div>
      <div className="flex text-xs desktop:text-sm">
        <input
          type="checkbox"
          checked={allHiddenToggled}
          id="toggle-all"
          className="mr-2 text-sm"
          onChange={toggleAllVisibility}
        />
        <label htmlFor="toggle-all">Toggle All Hidden Rows</label>
      </div>

      {hiddenRows.map((row, index) => (
        <div className="flex gap-2" key={index}>
          <input
            type="checkbox"
            id={`${row.label}-${index}`}
            checked={row.visible}
            onChange={() => toggleVisibility(row.label)}
          />
          <label
            className="text-xs desktop:text-sm"
            htmlFor={`${row.label}-${index}`}
          >
            {row.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default HiddenRowsToggle;
