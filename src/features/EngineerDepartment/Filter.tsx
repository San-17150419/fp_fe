import usePreFilter from "./hooks/usePreFilter";
// https://github.com/react-icons/react-icons/issues/154 TODO: Reduce icon size
// TODO:How to lazy load component
// TODO: I don't think Loading component block the whole page. Might be a problem.
import { type Site, type Sys } from "./types";
// https://github.com/radix-ui/primitives/issues/1634
import { type PreFilterData } from "./hooks/useENGDepartmentPreData";
import { lazy } from "react";
const PostFilter = lazy(() => import("./PostFilter"));
import Select from "../../Components/modd/Select/Select";

export default function Filter({
  seriesOptions,
  siteOptions,
  propertyOptions,
}: PreFilterData) {
  const {
    isLoading,
    setSys,
    setProperty,
    setSite,
    data,
    postFilterOptions,
    site,
    property,
    sys,
  } = usePreFilter();
  return (
    <div className="flex flex-wrap justify-around gap-4">
      <>
        <div className="h-10 flex-grow basis-[100px]">
          <Select<Sys | "">
            options={seriesOptions}
            name="series"
            onChange={(option) =>
              setSys(option.text === "全部系列" ? "" : (option.text as Sys))
            }
            value={sys}
          />
        </div>

        <div className="h-10 flex-grow basis-[100px]">
          <Select
            options={propertyOptions}
            name="property"
            onChange={(option) => {
              setProperty(option.value as string);
            }}
            value={property}
          />
        </div>
        <div className="h-10 flex-grow basis-[100px]">
          <Select
            options={siteOptions}
            name="site"
            onChange={(option) => setSite(option.value as Site)}
            value={site}
          />
        </div>

        <PostFilter
          data={data}
          postFilterOptions={postFilterOptions}
          isLoading={isLoading}
        />
      </>
    </div>
  );
}
