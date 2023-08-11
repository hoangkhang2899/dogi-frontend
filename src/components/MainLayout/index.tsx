import { memo, useRef } from "react";
import {
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";

import logo from "assets/images/logo.png";
import style from "./index.module.css";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { setSearch } from "slice/search";
import { removeAuth } from "store/auth";
import { ROLE } from "constant";
import { ChangePassword, ChangePasswordRef } from "components/ChangePassword";

export const MainLayout = memo(() => {
  const modalRef = useRef<ChangePasswordRef>(null);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(removeAuth());
  };
  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };
  return (
    <>
      <Navbar bg="light" expand="sm" sticky="top">
        <Container fluid className="justify-content-start flex-nowrap">
          <Link className={style.brand + " navbar-brand"} to="/">
            <img className={style.brand} src={logo} alt="Dogi Logo"></img>
          </Link>
          <Navbar.Toggle
            className={style.btn_expand}
            aria-controls={`offcanvasNavbar-expand-sm`}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-sm`}
            className="flex-grow-0"
            aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                Dogi Milktea
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-start flex-grow-1 pe-3">
                <NavLink
                  end
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? `${style.nav_link} ${style.active}`
                      : style.nav_link
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/danh-sach"
                  className={({ isActive }) =>
                    isActive
                      ? `${style.nav_link} ${style.active}`
                      : style.nav_link
                  }
                >
                  Danh sách
                </NavLink>
                {auth.role === ROLE.ADMIN ? (
                  <>
                    <NavLink
                      to="/san-pham"
                      className={({ isActive }) =>
                        isActive
                          ? `${style.nav_link} ${style.active}`
                          : style.nav_link
                      }
                    >
                      Sản phẩm
                    </NavLink>
                    <NavLink
                      to="/doanh-thu"
                      className={({ isActive }) =>
                        isActive
                          ? `${style.nav_link} ${style.active}`
                          : style.nav_link
                      }
                    >
                      Doanh thu
                    </NavLink>
                  </>
                ) : undefined}
                <NavDropdown
                  title="Tài khoản"
                  id="collasible-nav-dropdown"
                  bsPrefix={style.nav_link}
                >
                  <NavDropdown.Item disabled>{auth.username}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={openModal}>
                    Đổi mật khẩu
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <div className={style.search}>
            <Form.Control
              placeholder="Tìm kiếm"
              onChange={(e) => dispatch(setSearch(e.target.value))}
            ></Form.Control>
          </div>
        </Container>
      </Navbar>
      <ChangePassword ref={modalRef} />
      <Outlet />
    </>
  );
});
