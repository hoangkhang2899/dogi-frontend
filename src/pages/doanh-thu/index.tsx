import { ProductCount } from "components/ProductCount";
import { Report } from "components/Report";
import { useAppSelector } from "hooks/redux";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import dogiDriver from "services/dogi-driver";
import { TOrder } from "types/order";
import { TProduct } from "types/product";
import currencyFormatter from "utils/currency-formatter";
import { convertDate } from "utils/day-formatter";

import style from "./index.module.css";

type Counter = {
  shop: number;
  grab: number;
};

export const DoanhThu = () => {
  const { product } = useAppSelector((state) => state.main);
  const [order, setOrder] = useState<TOrder[]>([]);
  const [counter, setCounter] = useState<Counter>();
  const [confirm, setConfirm] = useState(false);
  const now = new Date();

  const countProduct = useCallback(
    (arr: TOrder[]) => {
      const coun = { shop: 0, grab: 0 };
      arr.forEach((v) => {
        v.orderProduct.forEach((v1) => {
          const findProd = product.find((find) => find._id === v1.product);
          if (
            findProd &&
            findProd.group !== "Thức ăn" &&
            findProd.group !== "Khác"
          ) {
            if (v.isGrab) {
              coun.grab += v1.amount;
            } else {
              coun.shop += v1.amount;
            }
          }
        });
      });
      return coun;
    },
    // eslint-disable-next-line
    [product.length]
  );

  useEffect(() => {
    if (order.length) {
      setCounter(countProduct(order));
    }
    //eslint-disable-next-line
  }, [order.length]);

  return (
    <Container fluid>
      {confirm ? (
        order.length && product.length ? (
          <>
            <Row xs={1} md={2} lg={3} xl={4}>
              <Col className="my-2">
                <div className={style.report_square}>
                  <span className={style.title}>Số ly đã bán</span>
                  <span className={style.body}>{counter?.shop}</span>
                </div>
              </Col>
              <Col className="my-2">
                <div className={style.report_square}>
                  <span className={style.title}>Số ly đã bán (Grab)</span>
                  <span className={style.body}>{counter?.grab}</span>
                </div>
              </Col>
              <Col className="my-2">
                <div className={style.report_square}>
                  <span className={style.title}>Tổng</span>
                  <span className={`${style.body} ${style.small}`}>
                    {currencyFormatter(
                      order.reduce((p, c) => p + c.totalPrice, 0)
                    )}
                  </span>
                </div>
              </Col>
              <Col className="my-2">
                <div className={style.report_square}>
                  <span className={style.title}>Tổng ca sáng</span>
                  <span className={`${style.body} ${style.small}`}>
                    {currencyFormatter(
                      order.reduce(
                        (p, c) =>
                          c.createdBy === "casang" ? p + c.totalPrice : p,
                        0
                      )
                    )}
                  </span>
                </div>
              </Col>
              <Col className="my-2">
                <div className={style.report_square}>
                  <span className={style.title}>Tổng ca chiều</span>
                  <span className={`${style.body} ${style.small}`}>
                    {currencyFormatter(
                      order.reduce(
                        (p, c) =>
                          c.createdBy === "cachieu" ? p + c.totalPrice : p,
                        0
                      )
                    )}
                  </span>
                </div>
              </Col>
            </Row>
            <ProductCount order={order} />
            <Report order={order} />
          </>
        ) : null
      ) : (
        <Form
          className="mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            const { fromDate, toDate } = e.target as HTMLFormElement;
            dogiDriver
              .get(`/order/in-range/${fromDate.value}/${toDate.value}`)
              .then((res) => {
                setConfirm(true);
                setOrder(res.data);
              });
          }}
        >
          <Form.Group>
            <Form.Label>Từ ngày</Form.Label>
            <Form.Control
              id="fromDate"
              type="date"
              min="2022-09-01"
              max={convertDate(now)}
              className="w-100 mx-auto mb-3"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Đến ngày</Form.Label>
            <Form.Control
              id="toDate"
              type="date"
              min="2022-09-01"
              max={convertDate(now)}
              className="w-100 mx-auto mb-3"
              required
            />
          </Form.Group>
          <Button type="submit">Xem chi tiết</Button>
          <Button
            type="button"
            className="mx-2"
            onClick={() => {
              const date = `${now.getFullYear()}-${
                now.getMonth() + 1
              }-${now.getDate()}`;
              dogiDriver.get(`/order/in-range/${date}/${date}`).then((res) => {
                setConfirm(true);
                setOrder(res.data);
              });
            }}
          >
            Xem hôm nay
          </Button>
        </Form>
      )}
    </Container>
  );
};
