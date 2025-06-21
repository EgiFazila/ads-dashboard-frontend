import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Id Proyek": null,
    "Judul": null,
    "Nama Pelanggan": null,
    "Asal Instansi/Unit": null,
    "Aktivitas": null,
    "Layanan": null,
    "Status": null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Judul Proyek] asc", Text: "Judul Proyek [↑]" },
  { Value: "[Judul Proyek] desc", Text: "Judul Proyek [↓]" },
  { Value: "[Nama Pelanggan] asc", Text: "Nama Pelanggan [↑]" },
  { Value: "[Nama Pelanggan] desc", Text: "Nama Pelanggan [↓]" },
];

export default function MasterProyekIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Judul Proyek] asc",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: 1,
      query: searchQuery.current?.value || "",
      sort: searchFilterSort.current?.value || "[Judul Proyek] asc",
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(
          API_LINK + "MasterProyek/GetDataProyek",
          currentFilter
        );

        if (!data || data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value) => ({
            ...value,
            Aksi: ["Toggle", "Detail", "Edit"],
            Alignment: [
              "center",   // No
              "center",   // Id Proyek
              "center",   // Title
              "center",   // Customer Name
              "center",   // Company/Dept
              "left",     // Activity
              "center",   // Services
              "center",   // Status
            ],
          }));
          setCurrentData(formattedData);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentFilter]);

  return (
    <div className="d-flex flex-column">
      {isError && (
        <div className="flex-fill">
          <Alert
            type="warning"
            message="Terjadi kesalahan: Gagal mengambil data proyek."
          />
        </div>
      )}
      <div className="flex-fill ">
        <Button
            iconName="add"
            classType="primary me-3 mb-3"
            label="Layanan Industri"
            onClick={() => onChangePage("add", { aktivitas: "Layanan Industri"})}
        />
        <Button
            iconName="add"
            classType="primary mb-3"
            label="Tridharma"
            onClick={() => onChangePage("add", { aktivitas: "Tridharma"})}
        />
        <div className="input-group">
          <Input
            ref={searchQuery}
            forInput="pencarianProyek"
            placeholder="Cari proyek..."
          />
          <Button
            iconName="search"
            classType="primary px-4"
            title="Cari"
            onClick={handleSearch}
          />
          <Filter>
            <DropDown
              ref={searchFilterSort}
              forInput="ddUrut"
              label="Urut berdasarkan"
              type="none"
              data={dataFilterSort}
              defaultValue="[Judul Proyek] asc"
            />
          </Filter>
        </div>
      </div>
      <div className="mt-3">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="d-flex flex-column">
            <Table
              data={currentData}
              onDetail={onChangePage}
              onEdit={onChangePage}
            />
            <Paging
              pageSize={PAGE_SIZE}
              pageCurrent={currentFilter.page}
              totalData={currentData?.[0]?.Count || 0}
              navigation={handleSetCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
