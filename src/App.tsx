import { useEffect } from "react";
import dogiDriver from "./services/dogi-driver";

import "./App.scss";

import { useAppDispatch } from "hooks/redux";
import { setProduct, setTopping } from "appSlice";

import { topping } from "components/Order/sample-db";
import { Route, Routes } from "react-router-dom";
import { DoanhThu } from "pages/doanh-thu";
import { OrderPage } from "pages/order";
import { MainLayout } from "components/MainLayout";
import { DanhSach } from "pages/danh-sach";
import { SanPhamPage } from "pages/san-pham";
import { PATH, ROLE } from "constant";
import { createPrivatePage } from "utils/private-page";
import { LoginPage } from "pages/dang-nhap";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    dispatch(setTopping(topping));
    dogiDriver.get("/product").then((res) => {
      if (res.data instanceof Array) {
        dispatch(setProduct(res.data));
      }
    });
    // eslint-disable-next-line
  }, []);
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={createPrivatePage(<OrderPage />)} />
        <Route
          path="/doanh-thu"
          element={createPrivatePage(<DoanhThu />, [ROLE.ADMIN])}
        />
        <Route path="/danh-sach" element={createPrivatePage(<DanhSach />)} />
        <Route
          path="/san-pham"
          element={createPrivatePage(<SanPhamPage />, [ROLE.ADMIN])}
        />
      </Route>
      <Route path={PATH.LOGIN} element={<LoginPage />} />
    </Routes>
  );
}

export default App;
