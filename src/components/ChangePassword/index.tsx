import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { successAudio } from "utils/audio";
import { changePassword } from "./context";

import style from "./index.module.css";

export type ChangePasswordRef = {
  show(): void;
  hide(): void;
};

type ChangePasswordProps = {};

export const ChangePassword = forwardRef<
  ChangePasswordRef,
  ChangePasswordProps
>((props, ref) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useImperativeHandle(ref, () => ({
    show() {
      handleOpen();
    },
    hide() {
      handleClose();
    },
  }));
  const handleClose = () => {
    setError("");
    setShow(false);
  };
  const handleOpen = () => {
    setShow(true);
  };
  const handleChangePassword = () => {
    if (formRef.current) {
      const oldPassword = (formRef.current as any).oldPassword;
      const newPassword = (formRef.current as any).newPassword;
      if (oldPassword.value && newPassword.value) {
        changePassword(oldPassword.value, newPassword.value)
          .then(() => {
            oldPassword.value = "";
            newPassword.value = "";
            handleClose();
            successAudio.play();
          })
          .catch((err) => {
            setError(err);
          });
      } else {
        setError("Nhập mật khẩu");
      }
    }
  };
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Đổi mật khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form ref={formRef} autoComplete="off">
          <Form.Group className="mb-3" controlId="oldPassword">
            <Form.Label>Mật khẩu cũ</Form.Label>
            <Form.Control className={style.password} type="text" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control className={style.password} type="text" />
          </Form.Group>
          {error ? <div className={style.error}>{error}</div> : undefined}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleChangePassword}>
          Đổi Mật Khẩu
        </Button>
      </Modal.Footer>
    </Modal>
  );
});
