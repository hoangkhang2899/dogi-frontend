import { useAppSelector } from "hooks/redux";
import { ChangeEvent, useCallback, useState } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { TOrder } from "types/order";
import { TProduct } from "types/product";

import style from "./index.module.css";

type Props = {
  order: TOrder[];
};

type ProductCounter = {
  amount: number;
} & TProduct;

export const ProductCount = ({ order }: Props) => {
  const { product } = useAppSelector((state) => state.main);
  const [productAmount, setProductAmount] = useState<ProductCounter[]>([]);

  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const group: ProductCounter[] = product.reduce((p, c) => {
      if (c.group === e.target.value) {
        return [...p, { ...c, amount: 0 }];
      }
      return p;
    }, [] as any);
    order.forEach((v) => {
      v.orderProduct.forEach((v1) => {
        if (v1.group === e.target.value) {
          const a = group.find((v) => v._id === v1.product);
          if (a) {
            a.amount += v1.amount;
          }
        }
      });
    });
    setProductAmount(group);
    // eslint-disable-next-line
  }, []);
  return (
    <Container>
      <div className={style.header}>Bảng SL chi tiết</div>
      <Form.Select
        aria-label="Default select example"
        className={style.select}
        onChange={handleChange}
      >
        <option value="">Chọn nhóm món</option>
        <option>Trà sữa</option>
        <option>Trà sữa trái cây</option>
        <option>Sữa tươi</option>
        <option>Trà trái cây</option>
        <option>Thức uống nóng</option>
        <option>Cafe</option>
        <option>Yaourt</option>
        <option>Thức ăn</option>
        <option>Khác</option>
      </Form.Select>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th style={{ paddingLeft: "2rem" }}>Tên món</th>
            <th style={{ width: "5rem", textAlign: "center" }}>SL</th>
          </tr>
        </thead>
        <tbody>
          {productAmount.map((v, i) => (
            <tr key={i}>
              <td>{v.name}</td>
              <td className="text-center">{v.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
