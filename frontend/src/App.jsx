import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../src/components/Footer"
// import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <div className="bg-[#fcd1d7] mt-[90px] text-[#8B4513] uppercase">
      <style>
        {`
          ::-webkit-scrollbar {
            width: 10px;
          }
          ::-webkit-scrollbar-track {
            background: #efdcd9;
          }
          ::-webkit-scrollbar-thumb {
            background: #800e25c4;
            border-radius: 5px;
            border: 2px solid #efdcd9;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #6b340f;
          }
        `}
      </style>
      <ToastContainer />
      <Navigation />
      <main className="pb-3 bg-[#] text-[#]">
        <Outlet />
      </main>
      <Footer />
    </div>

  );
};

export default App;
