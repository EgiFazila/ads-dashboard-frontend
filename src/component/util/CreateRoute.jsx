import { lazy } from "react";

const Beranda = lazy(() => import("../page/beranda/Root"));
const Notifikasi = lazy(() => import("../page/notifikasi/Root"));
const MasterDosen = lazy(() => import("../page/master-dosen/Root"));
const MasterMahasiswa = lazy(() => import("../page/master-mahasiswa/Root"));
const MasterAlat = lazy(() => import("../page/master-alat/Root"));
const MasterMataKuliah = lazy(() => import("../page/master-matakuliah/Root"));
const MasterProyek = lazy(() => import("../page/master-proyek/Root"));

const Dashboard = lazy(() => import("../page/dashboard/Root"));

const routeList = [
  {
    path: "/",
    element: <Beranda />,
  },
  {
    path: "/notifikasi",
    element: <Notifikasi />,
  },
  {
    path: "/master_dosen",
    element: <MasterDosen />,
  },
  {
    path: "/master_mahasiswa",
    element: <MasterMahasiswa />,
  },
  {
    path: "/master_matakuliah",
    element: <MasterMataKuliah />,
  },
  {
    path: "/master_alat",
    element: <MasterAlat />,
  },
  {
    path: "/master_proyek",
    element: <MasterProyek />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
];

export default routeList;