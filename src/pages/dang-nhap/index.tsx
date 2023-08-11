import { TOKEN_NAME } from "constant";
import { useAppDispatch } from "hooks/redux";
import { useEffect, useRef, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { updateAuth } from "store/auth";
import { login } from "./context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import noelImg from "assets/images/noel.png";
import houseImg from "assets/images/house.png";

import style from "./index.module.css";

export const LoginPage = () => {
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef<HTMLFormElement>(null);
  const handleLogin = () => {
    if (formRef && formRef.current) {
      const target = formRef.current as any;
      const username = target.username.value;
      const password = target.password.value;
      if (username && password) {
        login(username, password)
          .then((res) => {
            dispatch(updateAuth(res.data.userInfo));
            sessionStorage.setItem(TOKEN_NAME, res.data.accessToken);
            navigate(location.state?.redirect || "/", { replace: true });
          })
          .catch((err) => {
            setError(err);
          });
      } else {
        setError("Nhập tài khoản và mật khẩu");
      }
    }
  };
  useEffect(() => {
    const onEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    };
    window.addEventListener("keydown", onEnter);

    return () => {
      window.removeEventListener("keydown", onEnter);
    };
  }, []);
  return (
    <div className={style.container}>
      <img src={noelImg} className={style.img_noel} alt="" width="200px" />
      <img src={houseImg} className={style.img_house} alt="" />
      <Form ref={formRef} className={style.form} autoComplete="off">
        {error ? <div className={style.form_text}>{error}</div> : undefined}
        <FloatingLabel controlId="username" label="Tài khoản" className="mb-3">
          <Form.Control
            className={style.form_username}
            name="username"
            placeholder="Nhập tài khoản"
          />
        </FloatingLabel>
        <FloatingLabel controlId="password" label="Mật khẩu">
          <Form.Control
            className={style.form_password}
            name="password"
            placeholder="Nhập mật khẩu"
          />
          <div role="button" className={style.form_login} onClick={handleLogin}>
            <FontAwesomeIcon icon={faCircleArrowRight} size="xl" />
          </div>
        </FloatingLabel>
      </Form>
    </div>
  );
};
