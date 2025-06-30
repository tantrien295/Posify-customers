

import React, { useEffect, useState } from "react";
import { getKhachHangCount, getDichVuCount, getNhanVienCount, getLichSuCount } from "./api";

function App() {
  const [counts, setCounts] = useState({ kh: 0, dv: 0, nv: 0, ls: 0 });

  useEffect(() => {
    async function fetchCounts() {
      const [kh, dv, nv, ls] = await Promise.all([
        getKhachHangCount(),
        getDichVuCount(),
        getNhanVienCount(),
        getLichSuCount(),
      ]);
      setCounts({ kh, dv, nv, ls });
    }
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[var(--primary,#2563eb)] via-[var(--accent,#9333ea)] to-pink-100 p-4 transition-colors">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary,#2563eb)] via-[var(--accent,#9333ea)] to-pink-600 drop-shadow-lg">Dashboard Quản lý</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center group">
            <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-200">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4v2a2 2 0 01-2 2h-1.5" /></svg>
            </div>
            <span className="text-lg font-semibold text-blue-700">Khách hàng</span>
            <span className="text-3xl font-bold mt-1">{counts.kh}</span>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center group">
            <div className="bg-green-100 p-3 rounded-full mb-3 group-hover:bg-green-200">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3a4 4 0 014 4v2M9 17H7a2 2 0 01-2-2v-2a2 2 0 012-2h2m0 0V7a4 4 0 118 0v4" /></svg>
            </div>
            <span className="text-lg font-semibold text-green-700">Dịch vụ</span>
            <span className="text-3xl font-bold mt-1">{counts.dv}</span>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center group">
            <div className="bg-yellow-100 p-3 rounded-full mb-3 group-hover:bg-yellow-200">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" /></svg>
            </div>
            <span className="text-lg font-semibold text-yellow-700">Nhân viên</span>
            <span className="text-3xl font-bold mt-1">{counts.nv}</span>
          </div>
          {/* Card 4 */}
          <div className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center group">
            <div className="bg-red-100 p-3 rounded-full mb-3 group-hover:bg-red-200">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" /></svg>
            </div>
            <span className="text-lg font-semibold text-red-700">Lịch sử dịch vụ</span>
            <span className="text-3xl font-bold mt-1">{counts.ls}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Biểu đồ tổng quan <span className="text-xs text-gray-400">(coming soon)</span></h2>
          <div className="h-44 flex items-center justify-center text-gray-300 text-lg">[Biểu đồ sẽ hiển thị ở đây]</div>
        </div>
      </div>
    </div>
  );
}

export default App;
