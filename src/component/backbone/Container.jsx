import ContentBody from "./ContentBody";
import ContentTitle from "./ContentTitle";

export default function Container({ children }) {
  return (
    <div className="w-100 p-3"
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}>
      <ContentTitle />
      <ContentBody>{children}</ContentBody>
    </div>
  );
}
