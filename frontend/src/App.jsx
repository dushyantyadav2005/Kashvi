import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page whenever the route changes
  }, [location.pathname]); // Trigger the effect when the pathname changes

  return (
    <div className="bg-[#fdfeff] mt-[5rem] max-sm:mt-[4rem] text-[#4c3735] uppercase">
      <ToastContainer />
      <Navigation />
      <main className="pb-3 bg-[#] text-[#] min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;