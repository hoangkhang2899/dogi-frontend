import { Product } from "components/Product";

import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Container, Row, Col } from "react-bootstrap";

import { Order } from "components/Order";
import { setOrder } from "appSlice";

import currencyFormatter from "utils/currency-formatter";
import { TotalMobile, TTotalMobile } from "components/TotalMobile";
import { useCallback, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { TProduct } from "types/product";
import { removeAccent } from "utils/remove-accent";

import style from "./index.module.scss";

export const OrderPage = () => {
  const { product, order } = useAppSelector((state) => state.main);
  const search = useAppSelector((state) => state.search.value);
  const dispatch = useAppDispatch();
  const totalPrice = order.reduce((p, c) => p + c.price, 0);

  const totalMobile = useRef<TTotalMobile>(null);

  const sort = useMemo(
    () =>
      product.reduce((p, c) => {
        if (p[c.group]) {
          p[c.group].push(c);
        } else {
          p[c.group] = [c];
        }
        return p;
      }, {} as any),
    [product]
  );
  const statistical = useCallback(() => {
    return product.map((v, i) => {
      if (v.amount <= 2 && (v.group === "Thức ăn" || v.group === "Khác"))
        return (
          <span key={i} className="mx-2">
            <strong>{v.name}</strong>{" "}
            {v.amount <= 0 ? "hết hàng" : " sắp hết hàng"} ({v.amount || 0})
          </span>
        );
      return undefined;
    });
  }, [product]);
  const renderProduct = useMemo(() => {
    const key = Object.keys(sort);
    return key.map((v, i) => (
      <div key={v} className={style.tab}>
        <div className={style.tablist}>{v}</div>
        <Row xs={2} md={3} lg={4} xxl={5}>
          {sort[v].map((v1: TProduct) => (
            <Col key={v1._id} className="my-2">
              <Product
                item={v1}
                select={(item) => {
                  dispatch(setOrder(item));
                }}
              />
            </Col>
          ))}
        </Row>
      </div>
    ));
    // eslint-disable-next-line
  }, [sort, product]);

  const searchMatches = (text: string): TProduct[] => {
    const searchPattern = removeAccent(text.toLowerCase());
    const matches = product.filter((v) =>
      removeAccent(v.name.toLowerCase()).includes(searchPattern)
    );
    return matches;
  };

  return (
    <div className="wrapper">
      <Order />
      <Container>
        <div className={style.statistical}>{statistical()}</div>
        {search === "" ? (
          renderProduct
        ) : (
          <Row xs={2} md={3} lg={4} xxl={5}>
            {searchMatches(search).map((v, i) => (
              <Col key={i} className="my-2">
                <Product
                  item={v}
                  select={(item) => {
                    dispatch(setOrder(item));
                  }}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <TotalMobile ref={totalMobile} />

      <div
        className="m-total-button"
        onClick={() => totalMobile.current?.show()}
      >
        <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faArrowUp} />
        <span>Tổng thanh toán: {currencyFormatter(totalPrice)}</span>
      </div>
    </div>
  );
};
