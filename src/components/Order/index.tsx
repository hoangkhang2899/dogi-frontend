import {
  decrementAmount,
  incrementAmount,
  insertOrder,
  setOrder,
  setOrderSize,
} from "appSlice";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { FormEvent, useEffect, useRef } from "react";
import { Modal, Button, ModalProps, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import currencyFormatter from "utils/currency-formatter";
import "./index.css";

type TTopping = {
  id: number;
  name: string;
  price: number;
  checked?: boolean;
};

export const Order = () => {
  const { topping, orderProduct, isOrder, orderAmount, attributeIndex } =
    useAppSelector((state) => state.main);
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<ModalProps>(null);

  const submitForm = () => {
    if (orderProduct && attributeIndex !== undefined && orderAmount > 0) {
      const selectedAttribute = orderProduct.attribute[attributeIndex];
      if (formRef.current) {
        const { children } = formRef.current.children[0];
        const checkedTopping: TTopping[] = [];
        for (let i = 0; i < children.length; i++) {
          if (
            (
              children[i].children[0].children[0]
                .children[0] as HTMLInputElement
            ).checked
          ) {
            checkedTopping.push(topping[i]);
          }
        }
        const totalPriceTopping = checkedTopping.reduce(
          (p, c) => p + c.price,
          0
        );
        dispatch(
          insertOrder({
            product: orderProduct,
            topping: checkedTopping,
            attribute: attributeIndex,
            amount: orderAmount,
            price: (selectedAttribute.price + totalPriceTopping) * orderAmount,
          })
        );
      } else {
        dispatch(
          insertOrder({
            product: orderProduct,
            topping: [],
            attribute: attributeIndex,
            amount: orderAmount,
            price: selectedAttribute.price * orderAmount,
          })
        );
      }
      dispatch(setOrder(false));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitForm();
    // if (props.onOrder) props.onOrder();
  };

  useEffect(() => {
    if (orderProduct && orderProduct.attribute.length === 1)
      dispatch(setOrderSize(0));
    // eslint-disable-next-line
  }, [orderProduct]);

  return orderProduct ? (
    <Modal
      show={isOrder}
      ref={modalRef}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      scrollable
      centered
      onHide={() => dispatch(setOrder(false))}
      // onShow={() => dispatch(clearChecked)}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {orderProduct.name}
        </Modal.Title>
        <div className="order-radio">
          <div style={{ marginRight: "20px" }}>Size: </div>
          <Row>
            {orderProduct.attribute.map((v, i) => (
              <Col key={i}>
                <Form.Check
                  key={v.size}
                  type="radio"
                  id={v.size}
                  label={v.size}
                  checked={attributeIndex === i}
                  onChange={(e) => dispatch(setOrderSize(i))}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Modal.Header>
      {orderProduct.group !== "Thức ăn" && orderProduct.group !== "Khác" ? (
        <Modal.Body>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Row xs={1} md={1} lg={2}>
              {topping.map((v, i) => (
                <Col key={i} className="my-1">
                  <div className="order-check">
                    <Form.Check
                      className="order-check-name"
                      type="checkbox"
                      id={v.id.toString()}
                      label={v.name}
                    />
                    <span className="order-check-price">
                      {currencyFormatter(v.price)}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
          </Form>
        </Modal.Body>
      ) : null}
      <Modal.Footer>
        <div className="order-button">
          <Button
            variant="outline-primary"
            size="sm"
            className="add"
            onClick={() => dispatch(incrementAmount())}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <input type="number" value={orderAmount} readOnly></input>
          <Button
            variant="outline-primary"
            size="sm"
            className="substract"
            onClick={() => dispatch(decrementAmount())}
          >
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        </div>
        <Button
          variant="primary"
          disabled={orderAmount === 0 || attributeIndex === undefined}
          onClick={submitForm}
        >
          Order
        </Button>
        <Button variant="secondary" onClick={() => dispatch(setOrder(false))}>
          Huỷ
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
