import { useState } from "react";
import MasterPeriodeIndex from "./Index";
import MasterPeriodeAdd from "./Add";

export default function MasterPeriode() {
  const [pageMode, setPageMode] = useState("index");

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterPeriodeIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterPeriodeAdd onChangePage={handleSetPageMode} />;
    }
  }

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  return <div>{getPageMode()}</div>;
  
}