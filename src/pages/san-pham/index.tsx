import { insertProduct, removeProduct, updateProduct } from "appSlice";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import {
  BaseSyntheticEvent,
  FormEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Container,
  Form,
  Modal,
  ModalProps,
  Table,
} from "react-bootstrap";
import dogiDriver from "services/dogi-driver";
import { TProduct } from "types/product";
import currencyFormatter from "utils/currency-formatter";
import { removeAccent } from "utils/remove-accent";

type FormTarget = {
  name: HTMLInputElement;
  m: HTMLInputElement;
  l: HTMLInputElement;
  group: HTMLInputElement;
  amount?: HTMLInputElement;
};

type EditState = {
  status: boolean;
  _id?: string;
  name?: string;
  m?: number;
  l?: number;
  group?: string;
  amount?: number;
};

export const SanPhamPage = () => {
  const [edit, setEdit] = useState<EditState>({
    status: false,
  });
  const product = useAppSelector((state) => state.main.product);
  const search = useAppSelector((state) => state.search.value);
  const dispatch = useAppDispatch();
  const modalRef = useRef<ModalProps>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const handleShow = (product: TProduct) => {
    const { _id, name, attribute, group, amount } = product;
    const obj = attribute.reduce(
      (p, c) => ({ ...p, [c.size.toLowerCase()]: c.price }),
      {}
    );
    setEdit({ status: true, _id, name, ...obj, group, amount });
  };
  const handleHide = () => {
    setEdit({ status: false });
  };
  const handleAdd = () => {
    setEdit({ status: true });
  };
  const submitForm = () => {
    if (formRef.current) {
      const target: FormTarget = formRef.current as any;
      const { name, m, l, group, amount } = target;
      const arr: TProduct["attribute"] = [];
      if (m.value) {
        arr.push({ size: "M", price: +m.value });
      }
      if (l.value) {
        arr.push({ size: "L", price: +l.value });
      }
      if (arr.length && name.value && (m.value || l.value) && group.value) {
        const obj = {
          name: name.value,
          attribute: arr,
          group: group.value,
          amount: amount?.value,
        };
        if (edit._id) {
          Object.assign(obj, { _id: edit._id });
          dogiDriver.patch(`/product/${edit._id}`, obj).then(() => {
            dispatch(updateProduct(obj as any));
            handleHide();
          });
        } else {
          dogiDriver.post("/product", obj).then((res) => {
            if (res.statusText === "Created") {
              dispatch(insertProduct(res.data));
              handleHide();
            }
          });
        }
      }
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitForm();
  };
  const handleRemove = (id: string, index: number) => {
    if (window.confirm("Xác nhận xoá")) {
      dogiDriver.delete(`product/${id}`).then((res) => {
        dispatch(removeProduct(index));
      });
    }
  };
  const showPrice = (data: TProduct["attribute"], size: "M" | "L") => {
    const price = data.find((v) => v.size === size)?.price;
    if (price) {
      return currencyFormatter(price);
    }
  };
  const handleChange = (e: BaseSyntheticEvent) => {
    const { id, value } = e.target;
    setEdit((prev) => ({ ...prev, [id]: value }));
  };
  const renderProduct = useMemo(() => {
    return product.map((v, i) => (
      <tr key={v._id}>
        <td>{v.name}</td>
        <td className="text-center">{showPrice(v.attribute, "M")}</td>
        <td className="text-center">{showPrice(v.attribute, "L")}</td>
        <td className="text-center">
          {v.group === "Khác" || v.group === "Thức ăn" ? v.amount : undefined}
        </td>
        <td className="text-center">{v.group}</td>
        <td className="text-center">
          <Button
            className="mx-1"
            size="sm"
            variant="warning"
            onClick={() => handleShow(v)}
          >
            Sửa
          </Button>
          <Button
            className="mx-1"
            size="sm"
            variant="danger"
            onClick={() => handleRemove(v._id, i)}
          >
            Xoá
          </Button>
        </td>
      </tr>
    ));
    //eslint-disable-next-line
  }, [product]);
  const searchMatches = useCallback(
    (text: string): TProduct[] => {
      const searchPattern = removeAccent(text.toLowerCase());
      const matches = product.filter((v) =>
        removeAccent(v.name.toLowerCase()).includes(searchPattern)
      );
      return matches;
    },
    //eslint-disable-next-line
    [product]
  );
  return (
    <Container>
      <Modal
        show={edit.status}
        ref={modalRef}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        scrollable
        centered
        onHide={handleHide}
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Tên món</Form.Label>
              <Form.Control
                type="text"
                value={edit?.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="m">
              <Form.Label>Giá size M</Form.Label>
              <Form.Control
                type="number"
                value={edit?.m}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="l">
              <Form.Label>Giá size L</Form.Label>
              <Form.Control
                type="number"
                value={edit?.l}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Select
              id="group"
              aria-label="Chọn nhóm món"
              value={edit?.group}
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
            {edit.group === "Thức ăn" || edit.group === "Khác" ? (
              <Form.Group className="mb-3" controlId="amount">
                <Form.Label>Số lượng</Form.Label>
                <Form.Control
                  type="number"
                  value={edit?.amount}
                  onChange={handleChange}
                />
              </Form.Group>
            ) : undefined}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitForm}>
            Lưu
          </Button>
          <Button variant="secondary" onClick={handleHide}>
            Huỷ
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <Button className="m-2" onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Tên món</th>
            <th className="text-center">M</th>
            <th className="text-center">L</th>
            <th className="text-center">SL</th>
            <th className="text-center">Nhóm</th>
            <th className="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {search === ""
            ? renderProduct
            : searchMatches(search).map((v, i) => (
                <tr key={v._id}>
                  <td>{v.name}</td>
                  <td className="text-center">{showPrice(v.attribute, "M")}</td>
                  <td className="text-center">{showPrice(v.attribute, "L")}</td>
                  <td className="text-center">
                    {v.group === "Khác" || v.group === "Thức ăn"
                      ? v.amount
                      : undefined}
                  </td>
                  <td className="text-center">{v.group}</td>
                  <td className="text-center">
                    <Button
                      className="mx-1"
                      size="sm"
                      variant="warning"
                      onClick={() => handleShow(v)}
                    >
                      Sửa
                    </Button>
                    <Button
                      className="mx-1"
                      size="sm"
                      variant="danger"
                      onClick={() => handleRemove(v._id, i)}
                    >
                      Xoá
                    </Button>
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
    </Container>
  );
};
