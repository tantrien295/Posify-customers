
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import KhachHang from "./KhachHang";
import Navbar from "./Navbar";
const NhanVien = React.lazy(() => import("./NhanVien"));
const LichSuKhachHang = React.lazy(() => import("./LichSuKhachHang"));
const Service = React.lazy(() => import("./Service"));
const LichSuDichVuNgay = React.lazy(() => import("./LichSuDichVuNgay"));
const Settings = React.lazy(() => import("./Settings"));

export default function RouterApp() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/khachhang" element={<KhachHang />} />
        <Route path="/khachhang/:id" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <LichSuKhachHang />
          </React.Suspense>
        } />
        <Route path="/dichvu" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Service />
          </React.Suspense>
        } />
        <Route path="/nhanvien" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <NhanVien />
          </React.Suspense>
        } />
        <Route path="/settings" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Settings />
          </React.Suspense>
        } />
        <Route path="/lichsu" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <LichSuDichVuNgay />
          </React.Suspense>
        } />
      </Routes>
    </Router>
  );
}
