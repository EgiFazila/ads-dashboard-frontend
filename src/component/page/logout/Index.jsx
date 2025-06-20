import Cookies from "js-cookie";
import { ROOT_LINK } from "../../util/Constants";

export default function Logout() {
  Cookies.remove("activeUser");
  Cookies.remove("jwtToken");
  window.location.href = ROOT_LINK;
  return;
}
