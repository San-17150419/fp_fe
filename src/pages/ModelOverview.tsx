import Filter from "../features/EngineerDepartment/Filter";
import { useENGDepartmentContext } from "../features/EngineerDepartment/store/ENGDepartmentContext";
import Loading from "../Components/Loading";
export default function ModelOverview() {
  // TODO: Refactor FactoryLogFilter to make it reusable. I should consider using compound component pattern. In that way, you don't need to pre-define the number of select or input. May I need a small context
  //   TODO:Autocomplete input https://www.w3schools.com/howto/howto_js_autocomplete.asp (Do not use datalist. It is not supported in many browsers. )
  // TODO: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
  const { states } = useENGDepartmentContext();
  if (states === null) return <Loading />;

  return <Filter />;
}
