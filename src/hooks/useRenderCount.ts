import { useEffect, useRef } from "react";
const useRenderCount = () => {
  const rendersNo = useRef(0);
  useEffect(() => {
    rendersNo.current++;
  });
  console.log("Rerenders: " + rendersNo.current);
};

export default useRenderCount;
