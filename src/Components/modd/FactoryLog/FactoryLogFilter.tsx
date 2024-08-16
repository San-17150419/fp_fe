import Loading from "../../Loading";
import { type FactoryLogPreFilterProps, type DepartmentMap } from "./types";
import FactoryTable from "./FactoryTable";
import FactoryButtons from "./FactoryButtons";
import FactoryPreFilterItem from "./FactoryFilterItem";
import useFactoryFilter from "./hooks/useFactoryFilter";

export default function FactoryLogFilter({
  preData,
}: FactoryLogPreFilterProps) {
  const { isLoading, handleSubmit, filterConfig, logData, error } =
    useFactoryFilter(preData);
  const data = logData?.data;
  const factory = logData?.factory;
  const duration = logData?.duration;

  return (
    <>
      <section className="border-b border-black pb-5">
        <form id="form" onSubmit={handleSubmit} className="flex w-full">
          <div className="flex w-full flex-grow flex-wrap items-end gap-3">
            {Object.entries(filterConfig).map(([key, config]) => {
              return config.type === "input" &&
                config.defaultValue !== undefined ? (
                <FactoryPreFilterItem
                  key={key}
                  text={key}
                  type={config.type}
                  onChange={config.onChange}
                  defaultValue={config.defaultValue}
                />
              ) : config.type === "select" && config.options !== undefined ? (
                <FactoryPreFilterItem
                  key={key}
                  text={key}
                  type={config.type}
                  onChange={config.onChange}
                  options={config.options}
                />
              ) : null;
            })}
            <FactoryButtons factory={factory} duration={duration} />
          </div>
        </form>
      </section>
      {/* An indicator that a request is in progress */}
      {isLoading && <Loading />}
      {error && <p>{error}</p>}
      {/* Only show table when data is loaded */}

      {data &&
        factory &&
        duration &&
        Object.keys(data).map((department: string, index) => (
          <FactoryTable
            factory={factory}
            // TODO: modify type definition to enable type checking
            department={department as DepartmentMap[typeof factory]}
            sysData={data[department]}
            duration={duration}
            key={`${factory}-table-${department}-${index}`}
            index={index}
          />
        ))}
    </>
  );
}
