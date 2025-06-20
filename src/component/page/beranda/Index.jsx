import { useEffect, useRef, useState } from "react";
import { API_LINK } from "../../util/Constants";
import { formatMonthYear, separator } from "../../util/Formatting";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import "chart.js/auto";
import { Line, Bar } from "react-chartjs-2";

export default function BerandaIndex() {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [dataPermintaan, setDataPermintaan] = useState([]);
  const [dataRevenuePotential, setDataRevenuePotential] = useState([]);
  const [dataRevenueRealized, setDataRevenueRealized] = useState([]);
  const labels = [];
  for (let i = 0; i < 12; ++i) {
    labels.push(formatMonthYear(new Date().setMonth(i)));
  }

  const formDataRef = useRef({
    countTotalPermintaan: 0,
    countTotalPotensial: 0,
    countTotalRealisasi: 0,
    countDalamProses: 0,
    countOverdue: 0,
    countTerlambat: 0,
    countSelesai: 0,
  });

  // CHART REVENUE SETUP - BEGIN
  const dataRevenue = {
    labels: labels,
    datasets: [
      {
        label: "Total Potensial",
        data: dataRevenuePotential,
        borderColor: "gray",
        borderDash: [5, 5],
        tension: 0.4,
      },
      {
        label: "Total Terealisasi",
        data: dataRevenueRealized,
        backgroundColor: "green",
        borderColor: "green",
        tension: 0.4,
      },
    ],
  };
  const optionsRevenue = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Total Pendapatan Bulanan (Rp)",
        color: "black",
        font: {
          size: "20px",
          weight: "bold",
          family: "Barlow",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };
  // CHART REVENUE SETUP - END

  // CHART PRODUKSI SETUP - BEGIN
  const dataProduksi = {
    labels: labels,
    datasets: [
      {
        label: "Total Permintaan",
        data: dataPermintaan,
        backgroundColor: "rgba(13, 110, 253, 0.4)",
        borderColor: "rgba(13, 110, 253, 0.8)",
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };
  const optionsProduksi = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Total Permintaan Bulanan",
        color: "black",
        font: {
          size: "20px",
          weight: "bold",
          family: "Barlow",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };
  // CHART PRODUKSI SETUP - END

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data1 = await UseFetch(
          API_LINK + "Utilities/GetDataCountingDashboard",
          {}
        );

        if (data1 === "ERROR" || data1.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data dashboard.");
        } else {
          formDataRef.current = { ...formDataRef.current, ...data1[0] };
        }

        const data2 = await UseFetch(
          API_LINK + "Utilities/GetDataGrafikRevenueDashboard",
          { type: "Potential" }
        );

        if (data2 === "ERROR" || data2.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data dashboard.");
        } else {
          const formattedData = Object.values(data2[0]).map((val, index) => {
            return index <= new Date().getMonth() ? val : null;
          });
          setDataRevenuePotential(formattedData);
        }

        const data3 = await UseFetch(
          API_LINK + "Utilities/GetDataGrafikPermintaanDashboard",
          {}
        );

        if (data3 === "ERROR" || data3.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data dashboard.");
        } else {
          setDataPermintaan(Object.values(data3[0]));
        }

        setDataRevenueRealized([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <div className="row mx-0 my-2">
        <div className="col-lg-12 mb-1">
          <div className="px-3 py-2 bg-warning-subtle border-start border-5 border-warning mb-3 fw-bold">
            Dashboard di bawah ini masih dalam tahap pengembangan. Beberapa
            fitur belum dapat digunakan.
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-lg border-0 px-2 py-1 mb-4">
            <div className="card-body d-flex">
              <div className="px-3 py-2 me-4 rounded align-self-center bg-primary text-white">
                <Icon type="Bold" name="selling fs-3" />
              </div>
              <div>
                <h5>Total Permintaan Pelanggan</h5>
                <h3 className="fw-bold">
                  {formDataRef.current.countTotalPermintaan}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-lg border-0 px-2 py-1 mb-4">
            <div className="card-body d-flex">
              <div className="px-3 py-2 me-4 rounded align-self-center bg-warning text-white">
                <Icon type="Bold" name="chart-mixed-up-circle-dollar fs-3" />
              </div>
              <div>
                <h5>Total Pendapatan Potensial</h5>
                <h3 className="fw-bold">
                  Rp {separator(formDataRef.current.countTotalPotensial)}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-lg border-0 px-2 py-1 mb-4 opacity-25">
            <div className="card-body d-flex">
              <div className="px-3 py-2 me-4 rounded align-self-center bg-success text-white">
                <Icon type="Bold" name="revenue-alt fs-3" />
              </div>
              <div>
                <h5>Total Pendapatan Terealisasi</h5>
                <h3 className="fw-bold">-</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card shadow-lg border-0 px-2 py-1 mb-4">
            <div className="card-body d-flex">
              <div className="px-3 py-2 me-4 rounded align-self-center bg-primary text-white">
                <Icon type="Bold" name="process fs-3" />
              </div>
              <div>
                <h5>Dalam Proses Produksi</h5>
                <h3 className="fw-bold">
                  {formDataRef.current.countDalamProses}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card shadow-lg border-0 px-2 py-1 mb-4">
            <div className="card-body d-flex">
              <div className="px-3 py-2 me-4 rounded align-self-center bg-danger text-white">
                <Icon type="Bold" name="alarm-clock fs-3" />
              </div>
              <div>
                <h5>Produksi Overdue</h5>
                <h3 className="fw-bold">{formDataRef.current.countOverdue}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card shadow-lg border-0 px-2 py-1 mb-4 opacity-25">
            <div className="card-body d-flex">
              <div className="px-3 py-2 me-4 rounded align-self-center bg-warning text-white">
                <Icon type="Bold" name="time-delete fs-3" />
              </div>
              <div>
                <h5>Selesai Terlambat</h5>
                <h3 className="fw-bold">-</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card shadow-lg border-0 px-2 py-1 mb-4 opacity-25">
            <div className="card-body d-flex">
              <div className="px-3 py-2 me-4 rounded align-self-center bg-success text-white">
                <Icon type="Bold" name="time-check fs-3" />
              </div>
              <div>
                <h5>Selesai Tepat Waktu</h5>
                <h3 className="fw-bold">-</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-lg border-0 px-2 py-1 mb-4">
            <div className="card-body d-flex">
              <Bar data={dataProduksi} options={optionsProduksi} />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-lg border-0 px-2 py-1 mb-4">
            <div className="card-body d-flex">
              <Line data={dataRevenue} options={optionsRevenue} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
