import usePreFilter from "./hooks/usePreFilter";
// https://github.com/react-icons/react-icons/issues/154 TODO: Reduce icon size
// TODO:How to lazy load component
// TODO: I don't think Loading component block the whole page. Might be a problem.
import { Site } from "./types";
// https://github.com/radix-ui/primitives/issues/1634
import { useENGDepartmentContext } from "./store/ENGDepartmentContext";
import Select2 from "../../Components/modd/Select/Select2";
import PostFilterSkeleton from "./PostFilterSkeleton";
import PostFilter from "./PostFilter";

// const PostFilter = lazy(() => import("./PostFilter"));

export default function Filter() {
  const { states, seriesOptions, siteOptions, factoryOptions } =
    useENGDepartmentContext();
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
          <Select2 options={seriesOptions} name="series" onSelect={setSys} />
        </div>
        <div className="h-10 flex-grow basis-[100px]">
          <Select2
            options={factoryOptions}
            name="factory"
            onSelect={setProperty}
          />
        </div>
        <div className="h-10 flex-grow basis-[100px]">
          <Select2
            options={siteOptions}
            name="site"
            onSelect={(option: string) => setSite(option as Site)}
          />
        </div>
        {!dataLoaded ? (
          <PostFilterSkeleton />
        ) : (
          <PostFilter
            data={data}
            isLoading={isLoading}
            postFilterOptions={postFilterOptions}
          />
        )}
        {/* {isLoading ? (
          <PostFilterSkeleton />
        ) : (
          <PostFilter
            data={data}
            isLoading={isLoading}
            postFilterOptions={postFilterOptions}
          />
        )} */}
        {/* {Object.keys(data.allData).length === 0 ? (
          <PostFilterSkeleton />
        ) : (
          <PostFilter
            data={data}
            isLoading={isLoading}
            postFilterOptions={postFilterOptions}
          />
        )} */}
      </>
    </div>
  );
}
