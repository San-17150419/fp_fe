import { useAuthContext } from "../Components/modd/Table/FactoryLog/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
export default function ProtectedPage() {
  const { token } = useAuthContext();

  const location = useLocation();

  if (token === null) {
    return <Navigate to="/login" state={{ previousPath: location.pathname }} />;
  }

  return (
    <div className="m-12 flex p-20">
      <h2 className="m-auto block text-center text-3xl">
        This page is protected. Can't see it without login
      </h2>
    </div>
  );
}
