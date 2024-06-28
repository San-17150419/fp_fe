import Select from "../Components/modd/Select/Select";

export default function SelectPage() {
  return (
    <>
      <div className="flex flex-wrap gap-4">
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
      </div>
      <div className="flex flex-wrap gap-4">
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
    </>
  );
}
