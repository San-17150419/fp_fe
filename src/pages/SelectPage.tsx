import Select from "../Components/modd/Select/Select";
import { useState, FormEvent } from "react";

export default function SelectPage() {
  const [indicator, setIndicator] = useState<string>("");
  const [interval, setInterval] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const requestData1 = Object.fromEntries(formData.entries());
    const requestData = {
      factory: "GD",
      date_type: interval,
      date_start: date,
    };

    

    // Send request
    // const sendRequest = async () => {
    //   try {
    //     const response = await axios.post(
    //       "http://192.168.123.240:9000/api/fj/raw-data/",
    //       requestData,
    //     );
    //     setData(response.data);
    //     console.log(response.data);
    //     setIsDataReady(true);
    //     console.log(response.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // sendRequest();
  }
  const handleSelectChange = ( value: string) => {
    setIndicator(value);
  };
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
        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-4 place-items-center gap-4"
        >
          <Select
            onSelect={(value) => handleSelectChange(value)}
            name="indicator"
            options={[
              { value: "ar", text: "達成率" },
              { value: "pamt_h", text: "機均產出" },
            ]}
          />
          <Select
            onSelect={(value) => setInterval(value)}
            name="interval"
            options={[
              { value: "quarter", text: "自然季度" },
              { value: "half-year", text: "半年度" },
            ]}
          />

          <input
            onChange={(e) => setDate(e.target.value)}
            className="h-[38px] w-full rounded px-4"
            type="date"
            name="date"
            defaultValue={date}
            id="date"
          />
          <button
            type="submit"
            className="rounded bg-gray-400 p-2 px-4 text-white hover:bg-gray-500 hover:text-gray-700"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
