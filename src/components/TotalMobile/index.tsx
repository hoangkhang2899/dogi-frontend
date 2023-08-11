import { forwardRef, useImperativeHandle, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faX } from "@fortawesome/free-solid-svg-icons";
import {
  clearOrder,
  cloneOrder,
  removeOrder,
  updateProductAmount,
} from "appSlice";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { Button, Form } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import dogiDriver from "services/dogi-driver";
import currencyFormatter from "utils/currency-formatter";

import style from "./index.module.scss";
import { successAudio } from "utils/audio";

export type TTotalMobile = {
  show(): void;
};

type TotalMobileProps = {};

export const TotalMobile = forwardRef<TTotalMobile, TotalMobileProps>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);
    const [grab, setGrab] = useState(false);
    const { order, topping } = useAppSelector((state) => state.main);
    const dispatch = useAppDispatch();
    const totalPrice = grab ? 0 : order.reduce((p, c) => p + c.price, 0);
    const topArr = topping.map((v) => v.id);
    const handlePayment = () => {
      if (order.length) {
        const arr = order.reduce<any>((p, c) => {
          return [
            ...p,
            {
              product: c.product._id,
              topping: c.topping.reduce((p, c) => {
                const index = topArr.indexOf(c.id);
                return index === -1 ? [...p] : [...p, index];
              }, [] as number[]),
              attribute: c.attribute,
              amount: c.amount,
              price: c.price,
              group: c.product.group,
            },
          ];
        }, []);
        const obj = {
          orderProduct: arr,
          totalPrice: totalPrice,
          isGrab: grab,
        };
        dogiDriver.post("/order", obj).then((res) => {
          if (res.statusText === "Created" && res.data.length) {
            res.data.forEach((v: { _id: string; amount: number }) => {
              const { _id, amount } = v;
              dispatch(updateProductAmount({ _id, amount }));
            });
          }
          successAudio.play();
          dispatch(clearOrder());
        });
      }
    };

    const handleHide = () => {
      setVisible(false);
    };

    useImperativeHandle(ref, () => ({
      show() {
        setVisible(true);
      },
    }));

    return (
      <>
        <div className={style.total_side}>
          <div className={style.header}>Tổng thanh toán</div>
          <div className={style.total_side_content}>
            {order.map((v, i) => (
              <div className={style.content_order} key={i}>
                <div className={style.content_order_text}>
                  <div className={style.content_left}>
                    <div>{`${v.product.name} - ${
                      v.product.attribute[v.attribute].size
                    }`}</div>
                    {v.topping.length ? (
                      <div className={style.content_left_adding}>
                        {v.topping.map((v1) => (
                          <div key={v1.id}>{v1.name}</div>
                        ))}
                      </div>
                    ) : undefined}
                  </div>
                  <div className={style.content_right}>
                    <div>x{v.amount}</div>
                    <div>{currencyFormatter(v.price)}</div>
                  </div>
                </div>
                <div className={style.content_action}>
                  <Button
                    variant="info"
                    className="mx-2 w-25 mb-2"
                    onClick={() => {
                      dispatch(cloneOrder(i));
                    }}
                  >
                    <FontAwesomeIcon icon={faClone} />
                  </Button>
                  <Button
                    variant="danger"
                    className="mx-2 w-25 mb-2"
                    onClick={() => dispatch(removeOrder(i))}
                  >
                    <FontAwesomeIcon icon={faX} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className={style.footer}>
            <div className={style.footer_grab}>
              <label htmlFor="grab">GRAB</label>
              <label className={style.switch}>
                <input
                  id="grab"
                  type="checkbox"
                  checked={grab}
                  onChange={(e) => setGrab(e.target.checked)}
                />
                <span className={`${style.slider} ${style.round}`}></span>
              </label>
            </div>
            <div className={style.footer_total}>
              <span>Tổng:</span>
              <span>{currencyFormatter(totalPrice) || "0"}</span>
            </div>
            <Button
              className={style.footer_payment}
              onClick={handlePayment}
              disabled={order.length === 0}
            >
              Thanh toán
            </Button>
          </div>
        </div>
        <Offcanvas
          show={visible}
          placement="bottom"
          className={style.total}
          onHide={handleHide}
        >
          <Offcanvas.Header className={style.header} closeButton>
            <Offcanvas.Title>Tổng thanh toán</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className={style.total_side_content}>
              {order.map((v, i) => (
                <div className={style.content_order} key={i}>
                  <div className={style.content_order_text}>
                    <div className={style.content_left}>
                      <div>{`${v.product.name} - ${
                        v.product.attribute[v.attribute].size
                      }`}</div>
                      {v.topping.length ? (
                        <div className={style.content_left_adding}>
                          {v.topping.map((v1) => (
                            <div key={v1.id}>{v1.name}</div>
                          ))}
                        </div>
                      ) : undefined}
                    </div>
                    <div className={style.content_right}>
                      <div>x{v.amount}</div>
                      <div>{currencyFormatter(v.price)}</div>
                    </div>
                  </div>
                  <div className={style.content_action}>
                    <Button
                      variant="info"
                      className="mx-2 w-25 mb-2"
                      onClick={() => {
                        dispatch(cloneOrder(i));
                      }}
                    >
                      <FontAwesomeIcon icon={faClone} />
                    </Button>
                    <Button
                      variant="danger"
                      className="mx-2 w-25 mb-2"
                      onClick={() => dispatch(removeOrder(i))}
                    >
                      <FontAwesomeIcon icon={faX} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Offcanvas.Body>
          <div className={style.footer}>
            <div className={style.footer_grab}>
              <label htmlFor="grab">GRAB</label>
              <label className={style.switch}>
                <input
                  id="grab"
                  type="checkbox"
                  checked={grab}
                  onChange={(e) => setGrab(e.target.checked)}
                />
                <span className={`${style.slider} ${style.round}`}></span>
              </label>
            </div>
            <div className={style.footer_total}>
              <span>Tổng:</span>
              <span>{currencyFormatter(totalPrice) || "0"}</span>
            </div>
            <Button
              className={style.footer_payment}
              onClick={handlePayment}
              disabled={order.length === 0}
            >
              Thanh toán
            </Button>
          </div>
        </Offcanvas>
      </>
    );
  }
);
