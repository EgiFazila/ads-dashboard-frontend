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
import Modal from "../../part/Modal";
import Loading from "../../part/Loading";
import Cookies from "js-cookie";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Nama Bulan": null,
    "Total Minggu": null,
    "Tahun": null,
    Count: 0,
    Aksi: "",
  },
];

const dataFilterSort = [
  { Value: "[Nama Bulan] asc", Text: "Nama Bulan [↑]"},
  { Value: "[Nama Bulan] desc", Text: "Nama Bulan [↓]" },
  //{ Value: "[Tahun] asc", Text: "Tahun [↑]" },
  //{ Value: "[Tahun] desc", Text: "Tahun [↓]" },
];

export default function MasterPeriodeIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    sort: "[Nama Bulan] asc",
    page: 1,
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
      query: searchQuery.current.value,
      sort: searchFilterSort.current.value,
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(
          API_LINK + "MasterPeriode/GetDataPeriode",
          currentFilter
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value, idx) => ({
            ...value,
            Key: value.No || idx,
            Aksi: ["Delete"],
            Alignment: ["center", "center" , "center", "center", "center"],
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
              message="Terjadi kesalahan: Gagal mengambil data periode."
            />
          </div>
        )}
        <div className="flex-fill">
            <Button
              iconName="add"
              classType="primary mb-3"
              label="Tambah Data Periode"
              onClick={() => onChangePage("add")}
            />
            <div className="input-group">
              <Input
                ref={searchQuery}
                forInput="pencarianPeriode"
                placeholder="Cari..."
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
                  arrData={dataFilterSort}
                  defaultValue="[Nama Bulan] asc"
                />
              </Filter>
            </div>
        </div>

        {/* Tabel dan Paging */}
        <div className="mt-3">
           {isLoading ? (
              <Loading />
            ) : (
              <div className="d-flex flex-column">
                <Table
                  data={currentData}
                  //onDelete={handleDelete}
                />
                <Paging
                  pageSize={PAGE_SIZE}
                  pageCurrent={currentFilter.page}
                  totalData={currentData[0]["Count"]}
                  navigation={handleSetCurrentPage}
                />
             </div>
           )} 
        </div>
    </div>
  );
}