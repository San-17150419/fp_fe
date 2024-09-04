import Filter from "../features/EngineerDepartment/Filter";
import CreateMold from "../features/EngineerDepartment/CreateMold";
import WithPreData from "../features/EngineerDepartment/WithPreData";
export default function ModelOverview() {
  // TODO: Refactor FactoryLogFilter to make it reusable. I should consider using compound component pattern. In that way, you don't need to pre-define the number of select or input. May I need a small context
  // TODO: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
  // const { isLoading } = useENGDepartmentContext();
  const FilterWithPreData = WithPreData(Filter);
  const CreateMoldWithPreData = WithPreData(CreateMold);

  return (
    <>
      <CreateMoldWithPreData />
      <FilterWithPreData />
    </>
  );
}
