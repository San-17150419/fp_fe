import Loading from "../../Loading";
import { type FactoryLogPreFilterProps } from "./types/factoryLogDataType";
import FactoryLogTableContainer from "./FactoryLogTableContainer";
import FactoryButtons from "./FactoryButtons";
import FactoryPreFilterItem from "./FactoryFilterItem";
import useFilterState from "./hooks/useFactoryFilter";

export default function FactoryLogFilter({
  preData,
}: FactoryLogPreFilterProps) {
  const { isLoading, handleSubmit, filterConfig, factoryLogRawData } =
    useFilterState(preData);
  return (
    <>
      <section className="min-h-[100px] border-b border-black">
        <form id="form" onSubmit={handleSubmit} className="flex w-full">
          <div className="flex w-full flex-grow gap-4">
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
          </div>
          <FactoryButtons
            factory={factoryLogRawData?.post.factory}
            duration={factoryLogRawData?.duration}
          />
        </form>
      </section>
      {/* Show loading indicator when a request is made but data is not yet loaded */}
      {isLoading && !factoryLogRawData && <Loading />}
      {/* Only show table when data is loaded */}
      {factoryLogRawData && <FactoryLogTableContainer logData={factoryLogRawData} />}
    </>
  );
}
