import usePreFilter from "./hooks/usePreFilter";
// https://github.com/react-icons/react-icons/issues/154 TODO: Reduce icon size
// TODO:How to lazy load component
// TODO: I don't think Loading component block the whole page. Might be a problem.
import { Site } from "./types";
// https://github.com/radix-ui/primitives/issues/1634
import { type PreFilterData } from "./hooks/useENGDepartmentPreData";
import PostFilterSkeleton from "./PostFilterSkeleton";
import Loading from "../../Components/Loading";
import { lazy } from "react";
const PostFilter = lazy(() => import("./PostFilter"));
const Select = lazy(() => import("../../Components/modd/Select/Select"));

export default function Filter({
  seriesOptions,
  siteOptions,
  propertyOptions,
  states,
}: PreFilterData) {
  const {
    isLoading,
    setSys,
    setProperty,
    setSite,
    data,
    postFilterOptions,
    dataLoaded,
  } = usePreFilter(states.preData.series);

  return (
    <div className="flex flex-wrap justify-around gap-4">
      <>
        <div className="h-10 flex-grow basis-[100px]">
          <Select
            options={seriesOptions}
            name="series"
            onSelect={(option) => setSys(option.value as string)}
          />
        </div>

        <div className="h-10 flex-grow basis-[100px]">
          <Select
            options={propertyOptions}
            name="property"
            onSelect={(option) => {
              setProperty(option.value as string);
            }}
          />
        </div>
        <div className="h-10 flex-grow basis-[100px]">
          <Select
            options={siteOptions}
            name="site"
            onSelect={(option) => setSite(option.value as Site)}
          />
        </div>
        {!dataLoaded ? <Loading /> : null}
        {!dataLoaded ? (
          <PostFilterSkeleton />
        ) : (
          <PostFilter
            data={data}
            isLoading={isLoading}
            postFilterOptions={postFilterOptions}
          />
        )}
      </>
    </div>
  );
}
