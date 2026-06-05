// Fires an RSP signal on every route change.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fireSignal } from "@/lib/rsp/faaAdapter";

export function useRSPAdapter() {
  const location = useLocation();
  useEffect(() => {
    void fireSignal(location.pathname);
  }, [location.pathname]);
}
