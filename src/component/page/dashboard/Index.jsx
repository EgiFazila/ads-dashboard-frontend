import { useEffect, useRef, useState } from "react";
import { API_LINK } from "../../util/Constants";
import { formatMonthYear, separator } from "../../util/Formatting";
import "chart.js/auto";
import { Line, Bar, Pie } from "react-chartjs-2"; // ✅ Fix: include Pie

export default function DashboardIndex() {
    const [isError, setIsError] = useState({ error: false, message: "" });
    const [isLoading, setIsLoading] = useState(true);

    const labels = [];
    for (let i = 0; i < 12; ++i) {
        labels.push(formatMonthYear(new Date().setMonth(i)));
    }

    const cards = [
    "Persentase Ketercapaian ADS terhadap Matakuliah",
    "Presentase Proyek Internal VS External",
    "Jumlah Keikutsertaan Mahasiswa",
    "Jumlah ADS Setiap Bulan",
    "Status Proyek"
  ];

  return (
    <div className="p-6">
      <h2 className="text-center font-bold text-2xl mb-6">DASHBOARD</h2>

      <div className="grid grid-cols-3 gap-4">
        {cards.map((title, index) => (
          <div
            key={index}
            className="p-4 border rounded shadow min-h-[120px] flex items-center justify-center text-center text-sm"
          >
            <p className="font-semibold">{title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
