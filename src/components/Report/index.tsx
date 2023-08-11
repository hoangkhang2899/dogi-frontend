import { useAppSelector } from "hooks/redux";
import { Table } from "react-bootstrap";
import { TOrder } from "types/order";
import currencyFormatter from "utils/currency-formatter";

import style from "./index.module.css";

type ReportProps = {
  order: TOrder[];
};

export const Report = ({ order }: ReportProps) => {
  const { product, topping } = useAppSelector((state) => state.main);

  const getProduct = (id: string) => {
    return product.find((elem) => elem._id === id)?.name;
  };

  const getTopping = (listIndex: number[]) => {
    if (listIndex.length) {
      return listIndex.map((v, i) => (
        <div className={style.topping} key={i}>
          {topping[v].name}
        </div>
      ));
    }
    return undefined;
  };

  return (
    <>
      <div className={style.header}>Bảng order chi tiết</div>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Chi tiết</th>
            <th className="text-center">TT</th>
            <th className="text-center">User</th>
            <th className="text-center">Time</th>
          </tr>
        </thead>
        <tbody>
          {order.map((v, i) => (
            <tr key={v._id}>
              <td>
                {v.orderProduct.map((v1, i1) => (
                  <div className={style.product} key={i1}>
                    <div className={style.detail}>
                      {getProduct(v1.product)}
                      {getTopping(v1.topping)}
                    </div>
                    <div className={style.amount}>{v1.amount}</div>
                  </div>
                ))}
              </td>
              <td className="text-center">{currencyFormatter(v.totalPrice)}</td>
              <td className="text-center">{v.createdBy}</td>
              <td className="text-center">
                {new Date(v.createdDate).toLocaleString("vi-vn")}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
