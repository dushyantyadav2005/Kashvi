import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <div className="bg-[#fdfeff] mt-[5rem] max-sm:mt-[4rem] text-[#4c3735] uppercase">
      <ToastContainer />
      <Navigation />
      <main className=" min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>

  );
};

export default App;
