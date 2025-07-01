import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import { object, string, date, number } from "yup";
import Icon from "../../part/Icon";
import Cookies from "js-cookie";
import SearchDropdown from "../../part/SearchDropdown";

// const inisialisasiData = [
//   {
//     Key: null,
//     No: null,
//     Name: null,
//     Count: 0,
//   },
// ];

export default function MasterProyekAdd({ onChangePage, aktivitas }) {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ error: false, message: "" });
    const [aktivitasValue, setAktivitasValue] = useState("");
    const [listDosen, setListDosen] = useState([]);
    const [listMahasiswa, setListMahasiswa] = useState([]);
    const [memberData, setMemberData] = useState([]);
    
    const [selectedDosen, setSelectedDosen] = useState("");
    const [selectedMahasiswa, setSelectedMahasiswa] = useState("");
    
    const layananOptions =
      aktivitasValue === "Layanan Industri" 
      ? [
          { Value: "Pengujian", Text: "Pengujian" },
          { Value: "Pelatihan", Text: "Pelatihan" },
          { Value: "Konsultasi", Text: "Konsultasi" },
          { Value: "Konstruksi", Text: "Konstruksi" },
      ]
      : aktivitasValue === "Tri Dharma"
      ? [
          { Value: "Prakerin", Text: "Prakerin" },
          { Value: "Dosen Tamu", Text: "Dosen Tamu" },
          { Value: "PKM Riset Industri", Text: "PKM Riset Industri" },
          { Value: "Pertukaran", Text: "Pertukaran" },
      ]
      : [];

    const [formData, setFormData] = useState({
        proyekid: "",
        namaPelanggan: "",
        asalProyek: "",
        kategoriProyek: "",
        noSpk: "",
        aktivitas: aktivitas ?? "",
        layanan: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        judulProyek: "",
        namaAlat: "",
        durasiAlat: "",
        namaMaterial: "",
        semester: "",
        mataKuliah: "",
        statusProyek: "Sedang dalam Proses"
    });

    const dosenRef = useRef({ dsn_npk: "", dsn_nama: "" });
    const mahasiswaRef = useRef({ mhs_nim: "", mhs_nama: "" });

    useEffect(() => {
        const fetchDosen = async () => {
            setIsError({ error: false, message: "" });
            try {
                const jwtToken = Cookies.get("jwtToken");
                const response = await fetch(API_LINK + "MasterDosen/GetDataDosen", {
                    method: "POST",
                    headers: {
                       "Content-Type": "application/json",
                       Authorization: "Bearer " + jwtToken,
                    },
                    body: JSON.stringify({}),
                });

                if (!response.ok){
                    throw new Error("Gagal mengambil data dosen");
                }

                const data = await response.json();

                if (!Array.isArray(data))
                   setIsError({ error: true, message: "Format data dosen tidak valid" });

                setListDosen(
                    data.map((item) => ({
                        Value: item.dsn_npk || "",
                        Text: `${item.dsn_npk} - ${item.dsn_nama}`,
                        dsn_nama: item.dsn_nama,
                    }))
                );
            } catch (error){
                //window.scrollTo(0, 0);
                setIsError({ error: true, message: error.message });
                setListDosen([]);
            }
        };

        const fetchMahasiswa = async () => {
            setIsError({ error: false, message: "" });
            try {
                const jwtToken = Cookies.get("jwtToken");
                const response = await fetch(API_LINK + "MasterMahasiswa/GetDataMahasiswa", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization : "Bearer " + jwtToken,
                    },
                    body: JSON.stringify({}),
                });

                if (!response.ok){
                    throw new Error("Gagal mengambil data mahasiswa");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Format data mahasiswa tidak valid");
                }
                
                setListMahasiswa
                    (data.map((item) => ({
                        Value: item.mhs_nim || "",
                        Text: `${item.mhs_nim} - ${item.mhs_nama}`,
                        mhs_nama: item.mhs_nama,
                    }))
                );
            } catch (error){
                //window.scrollTo(0, 0);
                setIsError({ error: true, message: error.message });
                setListMahasiswa([]);
            }
        };

        fetchDosen();
        fetchMahasiswa();
    }, []);

    const handleAddMember = (selected) => {
      if (memberData.some(m => m.Key === selected.Value)) return;
      setMemberData(prev => [
        ...prev,
        {
          Key: selected.Value,
          Name: selected.Text,
        }
      ]);
    };

    /*
    const handleAddDosen = () => {
        const npk = dosenRef.current.dsn_npk;
        const selected = listDosen.find(d => d.Value === npk);
        if (!selected) {
            setIsError({ error: true, message: "Silakan pilih dosen" });
            return;
        }
        if (memberData.some(d => d.Key === npk && d.type === "dosen")) {
            setIsError({ error: true, message: "Dosen sudah ditambahkan" });
            return;
        }
        setDosenData(prev => [
            ...prev,
            {
              Key: npk,
              No: prev.filter(m => m.type === "dosen").length + 1,
              Nama: selected.dsn_nama,
              type: "dosen",
            }
        ]);
        dosenRef.current.dsn_npk = "";
        dosenRef.current.dsn_nama = "";  
    };

    const handleAddMahasiswa = () => {
        const nim = mahasiswaRef.current.mhs_nim;
        const selected = listMahasiswa.find(m => m.Value === nim);
        if (!selected) {
            setIsError({ error: true, message: "Silakan pilih mahasiswa" });
            return;
        }
        if (memberData.some(m => m.Key === nim && m.type === "mahasiswa")) {
            setIsError({ error: true, message: "Mahasiswa sudah ditambahkan" });
            return;
        }
        setMahasiswaData(prev => [
            ...prev,
            {
              Key: nim,
              No: prev.filter(m => m.type === "mahasiswa").length + 1,
              Nama: selected.mhs_nama,
              type: "mahasiswa"
            }
        ]);
        mahasiswaRef.current.mhs_nim = "";
        mahasiswaRef.current.mhs_nama = "";
    }; */

    const handleDeleteMember = (index) => {
      setMemberData(prev => 
        prev => prev.filter((_, i) => i !== index));
    };

    // Hapus dosen/mahasiswa dari tabel
    // const handleDeleteDosen = (index, type) => {
    //     setDosenData(prev => prev.filter((_, i) => i !== index));
    // };
    // const handleDeleteMahasiswa = (index) => {
    //     setMahasiswaData(prev => prev.filter((_, i) => i !== index));
    // };

    useEffect(() => {
        if (aktivitas){
            setAktivitasValue(aktivitas);
            setFormData((prev) => ({
                ...prev,
                aktivitas: aktivitas
            }));
        }
    }, [aktivitas]);

    useEffect(() => {
        if (formData.namaAlat && formData.tanggalMulai && formData.tanggalSelesai) {
            const start = new Date(formData.tanggalMulai);
            const end = new Date(formData.tanggalSelesai);

            if (!isNaN(start) && !isNaN(end) && end >= start) {
                const diffInDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1; 
                const durasi = diffInDays * 8;

                setFormData((prev) => ({
                    ...prev,
                    durasiAlat: `${durasi} Jam`
                }));

            } else {
                setFormData((prev) => ({
                    ...prev,
                    durasiAlat: ""
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                durasiAlat: ""
            }));
        }
    }, [formData.namaAlat, formData.tanggalMulai, formData.tanggalSelesai]);

    const proyekSchema = object({
        namaPelanggan: string().max(100, "maksimum 100 karakter").required("Nama Pelanggan harus diisi"),
        asalProyek: string().required("Asal Proyek harus diisi"),
        kategoriProyek: string().required("Kategori Proyek harus diisi"),
        layanan: string().required("Layanan harus diisi"),
        tanggalMulai: date().required("Tanggal Mulai harus diisi"),
        tanggalSelesai: date().required("Tanggal Selesai harus diisi"),
        judulProyek: string().required("Nama Proyek harus diisi"),
        semester: string().required("Semester harus diisi"),
        mataKuliah: string().required("Mata Kuliah harus diisi"),
    });
    

    const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        //if (e) e.preventDefault();
        const jwtToken = Cookies.get("jwtToken");
        try {
            await proyekSchema.validate(formData, { abortEarly: false });
            setErrors({});
            setIsLoading(true);

            const namaDosenArray = dosenData.map(d => d.Nama);
            const namaMahasiswaArray = mahasiswaData.map(m => m.Nama);

            const payload = {
                ...formData,
                dosen: namaDosenArray,
                mahasiswa: namaMahasiswaArray,
            };

            await fetch(API_LINK + "MasterProyek/createDataProyek", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + jwtToken,
                },
                body: JSON.stringify(payload),
            });
            //setIsLoading(false);
            //alert("Data berhasil dikirim!\n" + JSON.stringify(payload, null, 2));
            
        } catch (err) {
            if (err.inner){
                const newErrors = {};
                err.inner.forEach((validationError) => {
                    newErrors[validationError.path] = validationError.message;
                });
                setErrors(newErrors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card shadow p-4 mb-5 bg-white rounded">
            <div className="container-fluid">
                <h4 className="text-primary fw-bold text-center flex-grow-1 mb-2">Form Proyek</h4>

            <div className="container-fluid">
                {/* DATA USER */}
                <fieldset className="border rounded p-3 mb-3">
                    <legend className="legend-title">DATA USER</legend>
                    <div className="row">
                        <div className="col-md-2">
                            <Input
                            label="Kode Proyek"
                            name="proyekid"
                            //value={formData.proyekid}
                            readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <Input
                            label="Nama Pelanggan"
                            name="namaPelanggan"
                            isRequired={true}
                            onChange={handleChange}
                            error={errors.namaPelanggan}
                            />   
                        </div>
                        <div className="col-md-2">
                            <Input
                                label="Asal Instansi/Unit"
                                name="asalProyek"
                                isRequired={true}
                                onChange={handleChange}
                                error={errors.asalProyek}
                            />
                        </div>
                        <div className="col-md-2">
                            <DropDown
                                label="Kategori"
                                forInput="kategoriProyek"
                                isRequired={true}    
                                name="kategoriProyek"
                                onChange={handleChange}
                                error={errors.kategoriProyek}
                                value={formData.kategoriProyek}
                                arrData={[
                                    { Value: "Internal", Text: "Internal" },
                                    { Value: "Eksternal", Text: "Eksternal" },
                                ]}
                            />
                        </div>
                        <div className="col-md-3">
                            <Input
                                label="No SPK"
                                name="noSpk"
                                onChange={handleChange}
                                error={errors.noSpk}
                            />
                        </div>
                    </div>
                </fieldset>

                {/* DESKRIPSI PROJEK */}
                <fieldset className="border rounded p-3 mb-3">
                    <legend className="legend-title">DESKRIPSI PROJEK</legend>
                    <div className="row">
                        <div className="col-md-3">
                            <Input 
                            label="Aktivitas" 
                            name="aktivitas" 
                            value={aktivitasValue}
                            readOnly 
                            />
                        </div>
                        <div className="col-md-3">
                            <DropDown
                                label="Layanan"
                                forInput="layanan"
                                name="layanan"
                                isRequired={true}
                                onChange={handleChange}
                                error={errors.layanan}
                                value={formData.layanan}
                                arrData={layananOptions}
                            />
                        </div>
                        <div className="col-md-3">
                            <Input
                                type="date"
                                label="Tanggal Mulai"
                                name="tanggalMulai"
                                isRequired={true}
                                onChange={handleChange}
                                error={errors.tanggalMulai}
                            />
                        </div>
                        <div className="col-md-3">
                            <Input
                                type="date"
                                label="Tanggal Selesai"
                                name="tanggalSelesai"
                                isRequired={true}
                                onChange={handleChange}
                                error={errors.tanggalSelesai}
                            />
                        </div>
                        <div className="col-md-12 mt-3">
                            <Input
                                label="Judul/Detail Proyek"
                                name="judulProyek"
                                isRequired={true}
                                onChange={handleChange}
                                error={errors.judulProyek}
                            />
                        </div>
                    </div>
                </fieldset>

                {/* SUMBER DAYA */}
                <fieldset className="border rounded p-3 mb-5">
                  <legend className="legend-title">SUMBER DAYA</legend>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Dosen <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="input-group">
                        <div className="flex-grow-1">
                          <SearchDropdown
                            forInput="dsn_npk"
                            placeholder="Cari Dosen"
                            arrData={listDosen}
                            value={dosenRef.current.dsn_npk}
                            onChange={e => {
                              dosenRef.current.dsn_npk = e.target.value;
                              const selected = listDosen.find(d => d.Value === e.target.value);
                              dosenRef.current.dsn_nama = selected ? selected.dsn_nama : "";
                            }}
                          />
                        </div>
                        <Button
                          iconName="add"
                          label="Tambah Dosen"
                          className="btn btn-success"
                          type="button"
                          onClick={handleAddMember}
                        />
                      </div>
                      {memberData.filter(m => m.type === "dosen").length > 0 && (
                        <div className="table-responsive mt-2">
                          <table className="table table-sm table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th width="10%" className="text-center">No</th>
                                <th width="70%">Nama Dosen</th>
                                <th width="20%" className="text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {memberData.filter(m => m.type === "dosen").map((dosen, index) => (
                                <tr key={dosen.Key}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>{dosen.Nama}</td>
                                  <td className="text-center">
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleDeleteDosen(index, "dosen")}>
                                      <Icon name="trash" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Mahasiswa</label>
                      <div className="input-group">
                        <div className="flex-grow-1">
                          <SearchDropdown
                            forInput="mhs_nim"
                            placeholder="Cari Mahasiswa"
                            arrData={listMahasiswa}
                            value={mahasiswaRef.current.mhs_nim}
                            onChange={e => {
                              mahasiswaRef.current.mhs_nim = e.target.value;
                              const selected = listMahasiswa.find(m => m.Value === e.target.value);
                              mahasiswaRef.current.mhs_nama = selected ? selected.mhs_nama : "";
                            }}
                          />
                        </div>
                        <Button
                          iconName="add"
                          label="Tambah Mahasiswa"
                          className="btn btn-success"
                          type="button"
                          onClick={handleAddMember}
                        />
                      </div>
                      {memberData.filter(m => m.type === "mahasiswa").length > 0 && (
                        <div className="table-responsive mt-2">
                          <table className="table table-sm table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th width="10%" className="text-center">No</th>
                                <th width="70%">Nama Mahasiswa</th>
                                <th width="20%" className="text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {memberData.filter(m => m.type === "mahasiswa").map((mhs, index) => (
                                <tr key={index}>
                                  <td className="text-center">{mhs.No}</td>
                                  <td>{mhs.Nama}</td>
                                  <td className="text-center">
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleDeleteMahasiswa(index)}
                                    >
                                      <Icon name="trash" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <div className="col-md-3">
                      <DropDown
                        label="Semester"
                        forInput="semester"
                        name="semester"
                        isRequired={true}
                        onChange={handleChange}
                        error={errors.semester}
                        value={formData.semester}
                        arrData={Array.from({ length: 6 }, (_, i) => ({
                          Value: `${i + 1}`,
                          Text: `Semester ${i + 1}`,
                        }))}
                      />
                    </div>
                    <div className="col-md-4">
                      <Input
                        label="Mata Kuliah"
                        name="mataKuliah"
                        isRequired={true}
                        onChange={handleChange}
                        error={errors.mataKuliah}
                      />
                    </div>
                    <div className="col-md-3">
                      <Input
                        label="Alat/Mesin"
                        name="namaAlat"
                        onChange={handleChange}
                        error={errors.namaAlat}
                      />
                    </div>
                    <div className="col-md-2">
                      <Input
                        label="Durasi Alat"
                        name="durasiAlat"
                        value={formData.durasiAlat}
                        onChange={handleChange}
                        error={errors.durasiAlat}
                        readOnly
                      />
                    </div>
                    <div className="col-md-5">
                      <Input
                        label="Bahan/Material"
                        name="namaMaterial"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* BUTTONS */}
                <div className="text-end mb-3">
                    <Button 
                        label="Batal" 
                        classType="danger me-3" 
                        onClick={() => onChangePage("index")}
                    />
                    <Button 
                        label="Kirim Data Proyek" 
                        classType="primary" 
                        onClick={handleSubmit} 
                    />
                </div> 
            </div>
        </div>
    </div>
    )
}