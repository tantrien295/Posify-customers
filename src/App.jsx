

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getKhachHangCount, getDichVuCount, getNhanVienCount, getLichSuCount } from "./api";
import { getLichSuThangNayCount } from "./api-lichsu";
import { getLuotKhach5ThangGanNhat } from "./api-luotkhach";
import { getKhachHang5ThangGanNhat } from "./api-khachhang";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [counts, setCounts] = useState({ kh: 0, dv: 0, nv: 0, ls: 0 });
  const [lichSuThangNay, setLichSuThangNay] = useState(0);
  const [luotKhachChart, setLuotKhachChart] = useState([]);
  const [khachHangChart, setKhachHangChart] = useState([]);

  useEffect(() => {
    async function fetchCounts() {
      const [kh, dv, nv, ls, lsThangNay, luot5thang, khach5thang] = await Promise.all([
        getKhachHangCount(),
        getDichVuCount(),
        getNhanVienCount(),
        getLichSuCount(),
        getLichSuThangNayCount(),
        getLuotKhach5ThangGanNhat(),
        getKhachHang5ThangGanNhat(),
      ]);
      setCounts({ kh, dv, nv, ls });
      setLichSuThangNay(lsThangNay);
      setLuotKhachChart(luot5thang);
      setKhachHangChart(khach5thang);
    }
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[var(--primary,#2563eb)] via-[var(--accent,#9333ea)] to-pink-100 p-2 sm:p-4 transition-colors flex flex-col items-center">
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary,#2563eb)] via-[var(--accent,#9333ea)] to-pink-600 drop-shadow-lg">Dashboard Quản lý</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 mb-8 sm:mb-10 w-full">
          {/* Card 1 */}
          <Link to="/khachhang" className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 flex flex-col items-center group hover:shadow-2xl transition cursor-pointer w-full">
            <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-200">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4v2a2 2 0 01-2 2h-1.5" /></svg>
            </div>
            <span className="text-lg font-semibold text-blue-700">Khách hàng</span>
            <span className="text-3xl font-bold mt-1">{counts.kh}</span>
          </Link>
          {/* Card 2 */}
          <Link to="/dichvu" className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 flex flex-col items-center group hover:shadow-2xl transition cursor-pointer w-full">
            <div className="bg-green-100 p-3 rounded-full mb-3 group-hover:bg-green-200">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3a4 4 0 014 4v2M9 17H7a2 2 0 01-2-2v-2a2 2 0 012-2h2m0 0V7a4 4 0 118 0v4" /></svg>
            </div>
            <span className="text-lg font-semibold text-green-700">Dịch vụ</span>
            <span className="text-3xl font-bold mt-1">{counts.dv}</span>
          </Link>
          {/* Card 3 */}
          <Link to="/nhanvien" className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 flex flex-col items-center group hover:shadow-2xl transition cursor-pointer w-full">
            <div className="bg-yellow-100 p-3 rounded-full mb-3 group-hover:bg-yellow-200">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" /></svg>
            </div>
            <span className="text-lg font-semibold text-yellow-700">Nhân viên</span>
            <span className="text-3xl font-bold mt-1">{counts.nv}</span>
          </Link>
          {/* Card 4 */}
          <Link to="/lichsu" className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 flex flex-col items-center group hover:shadow-2xl transition cursor-pointer w-full">
            <div className="bg-red-100 p-3 rounded-full mb-3 group-hover:bg-red-200">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" /></svg>
            </div>
            <span className="text-lg font-semibold text-red-700">Lịch sử dịch vụ</span>
            <span className="text-3xl font-bold mt-1">{lichSuThangNay}</span>
            <span className="text-xs text-gray-500 mt-1">(trong tháng này)</span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mt-4 w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Biểu đồ tổng quan <span className="text-xs text-gray-400">(Lượt khách sử dụng dịch vụ 5 tháng gần nhất)</span></h2>
          <div className="h-64 flex items-center justify-center">
            {luotKhachChart.length > 0 ? (
              <Bar
                data={{
                  labels: luotKhachChart.map(m => m.label),
                  datasets: [
                    {
                      label: 'Lượt khách sử dụng dịch vụ',
                      data: luotKhachChart.map(m => m.count),
                      backgroundColor: 'rgba(37,99,235,0.7)',
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                  },
                }}
                height={220}
              />
            ) : (
              <div className="text-gray-300 text-lg">[Biểu đồ sẽ hiển thị ở đây]</div>
            )}
          </div>
          {/* Biểu đồ khách mới 5 tháng gần nhất */}
          <div className="h-64 flex items-center justify-center mt-8">
            {khachHangChart.length > 0 ? (
              <Bar
                data={{
                  labels: khachHangChart.map(m => m.label),
                  datasets: [
                    {
                      label: 'Số lượng khách mới',
                      data: khachHangChart.map(m => m.count),
                      backgroundColor: 'rgba(236,72,153,0.7)',
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                  },
                }}
                height={220}
              />
            ) : (
              <div className="text-gray-300 text-lg">[Biểu đồ khách mới sẽ hiển thị ở đây]</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
