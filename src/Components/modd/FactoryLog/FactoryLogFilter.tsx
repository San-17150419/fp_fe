import Loading from "../../Loading";
import { type FactoryLogPreFilterProps, type DepartmentMap } from "./types";
import FactoryTable from "./FactoryTable";
import FactoryPreFilterItem from "./FactoryFilterItem";
import useFactoryFilter from "./hooks/useFactoryFilter";
import FactorySearchButton from "./FactorySearchButton";
import DownloadExcelButton from "./DownloadExcelButton";

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
          <div className="lg:grid-cols-54 xl:grid-cols-52 p grid w-full grid-flow-row-dense grid-cols-9 items-end gap-x-2 lg:gap-0 lg:space-x-2">
            {Object.entries(filterConfig).map(([key, config]) => {
              return config.type === "input" &&
                config.defaultValue !== undefined ? (
                <div className="col-span-4 lg:col-span-12" key={key}>
                  <FactoryPreFilterItem
                    text={key}
                    type={config.type}
                    onChange={config.onChange}
                    defaultValue={config.defaultValue}
                  />
                </div>
              ) : config.type === "select" && config.options !== undefined ? (
                <div className="col-span-4 lg:col-span-12" key={key}>
                  <FactoryPreFilterItem
                    text={key}
                    type={config.type}
                    onChange={config.onChange}
                    options={config.options}
                  />
                </div>
              ) : null;
            })}
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
              {/* <div className="mt-auto place-self-center"> */}
              <FactorySearchButton formId="form" />
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
              <DownloadExcelButton factory={factory} duration={duration} />
            </div>
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
