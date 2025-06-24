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

export default function MasterProyekAdd({ onChangePage, aktivitas }) {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ error: false, message: "" });
    const [aktivitasValue, setAktivitasValue] = useState("");
    const [listDosen, setListDosen] = useState([]);
    const [listMahasiswa, setListMahasiswa] = useState([]);


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
        namaDosen: "",
        namaAlat: "",
        durasiAlat: "",
        namaMaterial: "",
        semester: "",
        mataKuliah: "",
        namaMahasiswa: "",
        statusProyek: "Sedang dalam Proses"
    });

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
        namaPelanggan: string()
            .max(100, "maksimum 100 karakter")
            .required("Nama Pelanggan harus diisi"),
        asalProyek: string().required("Asal Proyek harus diisi"),
        kategoriProyek: string().required("Kategori Proyek harus diisi"),
        noSpk: string(),
        aktivitas: string(),
        layanan: string().required("Layanan harus diisi"),
        tanggalMulai: date().required("Tanggal Mulai harus diisi"),
        tanggalSelesai: date().required("Tanggal Selesai harus diisi"),
        judulProyek: string().required("Nama Proyek harus diisi"),
        namaDosen: string().required("Input Dosen harus diisi"),
        namaAlat: string().nullable(),
        durasiAlat: string(),
        namaMaterial: string(),
        semester: string().required("Semester harus diisi"),
        mataKuliah: string().required("Mata Kuliah harus diisi"),
        namaMahasiswa: string().required("Mahasiswa harus diisi")
    });
    

    const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        try {
            await proyekSchema.validate(formData, { abortEarly: false });
            setErrors({});
            setIsLoading(true);
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
                            label="ID Proyek"
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
                                arrData={[
                                    { Value: "Pengujian", Text: "Pengujian" },
                                    { Value: "Pelatihan", Text: "Pelatihan" },
                                    { Value: "Konsultasi", Text: "Konsultasi" },
                                    { Value: "Konstruksi", Text: "Konstruksi" },
                                ]}
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
                        <div className="col-md-3">
                            <Input
                            label="Dosen"
                            name="namaDosen"
                            isRequired={true}
                            //value={formData.namaDosen}
                            onChange={handleChange}
                            error={errors.namaDosen}
                            />
                        </div>
                        <div className="col-md-4">
                            <Input
                            label="Mahasiswa"
                            name="namaMahasiswa"
                            isRequired={true}
                            onChange={handleChange}
                            error={errors.namaMahasiswa}
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
                        label="Kirim" 
                        classType="primary" 
                        onClick={handleSubmit} 
                    />
                </div> 
            </div>
        </div>
    </div>
    )
}