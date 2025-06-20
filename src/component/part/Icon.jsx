export default function Icon({
  type = "Regular",
  name,
  cssClass = "",
  ...props
}) {
  switch (type) {
    case "Regular":
      return <i className={"fi fi-rr-" + name + " " + cssClass} {...props}></i>;
    case "Bold":
      return <i className={"fi fi-br-" + name + " " + cssClass} {...props}></i>;
    case "Solid":
      return <i className={"fi fi-sr-" + name + " " + cssClass} {...props}></i>;
    case "Thin":
      return <i className={"fi fi-tr-" + name + " " + cssClass} {...props}></i>; 
  }
}
