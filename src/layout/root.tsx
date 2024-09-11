import { routes } from "@/constants/routes";
import { ChevronLeft } from "lucide-react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full bg-gray-800 min-h-screen text-white flex items-center flex-col gap-4 p-5">
      <nav className="w-full relative text-center">
        <Link
          to={routes.HOME}
          className="absolute left-1 top-0 bottom-0 w-fit rounded-full h-fit p-2 hover:scale-110 ease-out transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-bold text-2xl">
          Calculadora de colas de sistemas estables
        </h1>
      </nav>
      <div className="max-w-7xl w-full h-full mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
