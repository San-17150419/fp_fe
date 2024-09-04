import useENGDepartmentPreData from "./hooks/useENGDepartmentPreData";
import Loading from "../../Components/Loading";
import ErrorPage from "../../pages/ErrorPage";
import {type PreFilterData} from "./hooks/useENGDepartmentPreData";
// A HOC that wraps a component with pre data from the server
// encapsulates the usePreData hook and passes the data to the wrapped component 
// 
export default function withPreData<T>(Component: React.ComponentType<T & PreFilterData>) {
  return function WrappedComponent(props: T) {
    const { isPending, data, error } = useENGDepartmentPreData();

    if (isPending || !data) return <Loading />;
    if (error) return <ErrorPage error={error} />;
    return <Component {...props} {...data} />;
  };
}