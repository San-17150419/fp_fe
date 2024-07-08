import Select from "../Components/modd/Select/Select";

export default function SelectPage() {
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <Select name="number" options={["1", "2", "3"]} />
        <Select
          name="name"
          options={[
            { id: 1, value: "Durward Reynolds" },
            { id: 2, value: "Kenton Towne" },
            { id: 3, value: "Therese Wunsch" },
            { id: 4, value: "Benedict Kessler" },
            { id: 5, value: "Katelyn Rohan" },
          ]}
        />
      </div>
      <div>
        <Select
          name="sys"
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
