import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <div className="bg-[#f3e4ad] text-[#4c3735] uppercase">
      <ToastContainer />
      <Navigation />
      <main className="pb-3 bg-[#] text-[#]">
        <Outlet />
      </main>
    </div>

  );
};

export default App;
