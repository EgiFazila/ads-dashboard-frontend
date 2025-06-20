import moment from "moment";
import "moment/dist/locale/id";

export const separator = (input) => {
  let parsedInput = parseFloat(input.toString().replace(/\./g, ""));

  if (isNaN(parsedInput)) return "";

  const options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
    decimal: ",",
    thousands: ".",
  };

  return parsedInput.toLocaleString("id-ID", options);
};

export const clearSeparator = (input) => {
  if (input) {
    let parsedInput = parseFloat(input.toString().replace(/\./g, ""));
    return parsedInput;
  }
  return 0;
};

export const formatDate = (input, dateOnly = false) => {
  return dateOnly
    ? moment(input).format("DD MMMM yyyy")
    : moment(input).format("DD MMMM yyyy, HH:mm");
};

export const formatDateScheduling = (input) => {
  const formattedDate = moment(input).format("DD-MMM-yyyy");
  return formattedDate === "Invalid date" ? "" : formattedDate;
};

export const formatDateSchedulingRevert = (dateString) => {
  const parts = dateString.split("-");
  const day = parts[0];
  const month =
    new Date(Date.parse(convertIDtoENMonth(parts[1]) + " 1")).getMonth() + 1;
  const year = parts[2];

  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDay}`;
};

export const formatMonthYear = (input) => {
  return moment(input).format("MMMM");
};

function convertIDtoENMonth(month) {
  switch (month) {
    case "Mei":
      return "May";
    case "Agt":
      return "Aug";
    case "Okt":
      return "Oct";
    case "Des":
      return "Dec";
    default:
      return month;
  }
}
