import { motion } from "framer-motion";
import Image from "../../../assets/IMG_Tkbg.jpg";

export default function BerandaIndex() {
  return (
    <div 
      className="container-fluid d-flex align-items-center justify-content-center" 
      style={{ minHeight: "calc(100vh - 80px)", overflow: "hidden" }}
    >
      <div className="row w-100 align-items-center justify-content-center">
        <motion.div
          className="col-md-6 text-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={Image}
            alt="Welcome"
            className="img-fluid rounded shadow"
            style={{ maxWidth: "850px", height: "auto" }}
          />
        </motion.div>

        <motion.div
          className="col-md-6 text-center text-md-start mt-4 mt-md-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h5 
            className="text-primary text-center fw-semibold"
            style={{ fontSize: "1.5rem" }}
            >
              Welcome to
          </h5>
          <h1 
            className="fw-bold text-center text-dark mb-3"
            style={{ fontSize: "2.8rem" }}
            >
              ASTRAtech Dual System
          </h1>
          <h4 
            className="text-secondary text-center mb-4"
            style={{ fontSize: "1.4rem" }}
            >
              Monitoring Dashboard
            </h4>
        </motion.div>
      </div>
    </div>
  );
}