import { useState } from "react";
import DashboardIndex from "./Index";

export default function Dashboard() {
  const [pageMode, setPageMode] = useState("index");

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <DashboardIndex onChangePage={handleSetPageMode} />;
    }
  }

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  return <div>{getPageMode()}</div>;
  
}