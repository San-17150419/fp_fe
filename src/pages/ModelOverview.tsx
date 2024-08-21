import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Components/Loading";
import { type ENGDepartmentPreData } from "../features/EngineerDepartment/EngineerDepartmentTypes";
import Filter from "../features/EngineerDepartment/Filter";
export default function ModelOverview() {
  // TODO: Refactor FactoryLogFilter to make it reusable. I should consider using compound component pattern. In that way, you don't need to pre-define the number of select or input. May I need a small context
  //   TODO:Autocomplete input https://www.w3schools.com/howto/howto_js_autocomplete.asp (Do not use datalist. It is not supported in many browsers. )
  const [states, setStates] = useState<ENGDepartmentPreData | null>(null);
  useEffect(() => {
    const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "pre-data/";
    const fetchPreData = async () => {
      try {
        const response = await axios.get<ENGDepartmentPreData>(api);
        const data = response.data;
        setStates(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreData();
  }, []);

  if (!states) return <Loading />;

  return (
    <div>
      {states && (
        <Filter
          preData={states.preData}
          sysDictionary={states.preData.series}
        />
      )}
    </div>
  );
}
