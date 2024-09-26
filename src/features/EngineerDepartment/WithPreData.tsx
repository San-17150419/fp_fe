import Loading from "../../Components/Loading";
import { type PreFilterData } from "./hooks/useENGDepartmentPreData";
import { useQuery } from "@tanstack/react-query";
export default function withPreData<T>(
  Component: React.ComponentType<T & PreFilterData>,
) {
  return function WrappedComponent(props: T) {
    // You can call useQuery without queryFn with enabled: false.  This allows you to subscribe to a query without fetching it.
    const { data } = useQuery<PreFilterData>({
      queryKey: ["ENGDPreData"],
      enabled: false,
    });

    // You can also use useQueryClient to access the data from the query cache. But this does not allow you to subscribe to a query. Meaning that if the data changes, the component won't be re-rendered. It's acceptable in this case because ENGDPreData is relatively static and unlikely to change during the lifetime of the app.

    // const queryClient = useQueryClient();
    // const data = queryClient.getQueryData<PreFilterData>(["ENGDPreData"]);
    if (!data) return <Loading />;
    return <Component {...props} {...data} />;
  };
}
