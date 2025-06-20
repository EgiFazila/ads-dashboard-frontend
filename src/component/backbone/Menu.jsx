import { useEffect, useState } from "react";
import Icon from "../part/Icon";
import { BASE_ROUTE, ROOT_LINK } from "../util/Constants";
import { Link, useLocation } from "react-router-dom";

export default function Menu({
  listMenu,
  isShow,
  handleShowMenu,
  displayName,
  roleName,
}) {
  const location = useLocation();
  const [currentURL, setCurrentURL] = useState(
    window.location.protocol +
      "//" +
      window.location.host +
      BASE_ROUTE +
      location.pathname
  );
  const [currentTitle, setCurrentTitle] = useState("");

  function checkIcon(menu) {
    let menuIcon = "angle-down";

    switch (menu) {
      case "Logout":
        menuIcon = "sign-out-alt";
        break;
      case "Beranda":
        menuIcon = "home";
        break;
    }

    return menuIcon;
  }

  function handleMenuAktif(title) {
    setCurrentTitle(title);
    setCurrentURL(
      window.location.protocol +
        "//" +
        window.location.host +
        BASE_ROUTE +
        location.pathname
    );
    if (document.getElementById("spanMenu")) {
      document.getElementById("spanMenu").innerHTML = title;
    }
  }

  useEffect(() => {
    let title = currentTitle;
    let currentLink = ROOT_LINK + location.pathname;
    if (title === "") {
      try {
        const foundItem = listMenu.find(
          (item) =>
            item.link === currentLink ||
            item.sub.find((subItem) => subItem.link === currentLink)
        );
        title =
          foundItem.head +
          (foundItem.sub.length > 0
            ? " - " +
              foundItem.sub.find((item) => item.link === currentLink)["title"]
            : "");
      } catch {}
    }
    handleMenuAktif(title);
    handleShowMenu(false);
  }, [location]);

  return (
    <nav>
      {isShow && (
        <div className="w-100 px-4 py-3 d-flex bg-warning-subtle">
          Halo,
          <span className="fw-bold ms-1">
            {displayName} ({roleName})
          </span>
        </div>
      )}
      {listMenu.map((menu) => {
        if (!menu.isHidden) {
          return (
            <div key={"#menucollapse" + menu["headkey"]}>
              <Link
                className="text-decoration-none text-black fw-bold"
                data-bs-toggle={menu["link"] === "#" ? "collapse" : ""}
                to={menu["link"] === "#" ? "#" : menu["link"]}
                reloadDocument={menu["link"] === ROOT_LINK + "/logout"}
                onClick={
                  menu["link"] === "#"
                    ? () => {}
                    : () => handleMenuAktif(menu["head"])
                }
              >
                <div
                  className={
                    "w-100 px-4 py-2 d-flex" +
                    (currentURL === menu["link"]
                      ? " bg-primary text-white"
                      : "")
                  }
                >
                  <Icon
                    type="Bold"
                    name={checkIcon(menu["head"])}
                    cssClass="me-2"
                    style={{ marginTop: "2px" }}
                  />
                  <span>{menu["head"]}</span>
                </div>
              </Link>
              <div
                className="collapse show"
                id={"menucollapse" + menu["headkey"]}
              >
                {menu["sub"].map((sub) => {
                  return (
                    <Link
                      className="text-decoration-none text-black"
                      to={sub["link"]}
                      key={"#menucollapse" + menu["headkey"] + sub["link"]}
                      target={
                        sub["link"].replace(ROOT_LINK, "").includes("https://")
                          ? "_blank"
                          : "_self"
                      }
                      onClick={() =>
                        handleMenuAktif(menu["head"] + " - " + sub["title"])
                      }
                    >
                      <div
                        className={
                          "w-100 pe-4 py-1 d-flex fw-medium" +
                          (currentURL === sub["link"]
                            ? " bg-primary text-white"
                            : "")
                        }
                        style={{ paddingLeft: "45px" }}
                      >
                        <Icon name="minus-small" cssClass="me-2 mt-1" />
                        <span>{sub["title"]}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }
      })}
    </nav>
  );
}