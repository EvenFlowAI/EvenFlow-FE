import { useLocation } from "react-router-dom";
import { useMemo } from "react";

type TLParams = {
  frame?: string;
};
export const useLayout = () => {
  const { search } = useLocation<TLParams>();
  return useMemo(() => {
    const isFrame = new URLSearchParams(search).get("frame")?.toLowerCase();
    if (isFrame) {
      return isFrame.includes("true") || isFrame.includes("1");
    }
    return false;
  }, [search]);
};
