import { Report } from "components/Report";
import { useEffect, useState } from "react";
import dogiDriver from "services/dogi-driver";
import { TOrder } from "types/order";

export const DanhSach = () => {
  const [order, setOrder] = useState<TOrder[]>([]);
  useEffect(() => {
    dogiDriver.get("/order/today").then((res) => setOrder(res.data));
  }, []);
  return order.length ? <Report order={order} /> : null;
};
