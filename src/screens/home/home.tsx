import { routes } from "@/constants/routes";
import { Link } from "react-router-dom";

const types = [
  {
    name: "M/M/1",
    path: routes.MM1,
  },
  {
    name: "M/M/C",
    path: routes.MMC,
  },
];

const HomePage = () => {
  return (
    <div className="w-full h-full gap-5 grid grid-cols-2 p-4">
      {types.map((type, idx) => (
        <Link key={idx} to={type.path}>
          <div className="rounded-md border bg-gray-800 hover:bg-gray-900 transition-all ease-out duration-200 flex justify-center items-center border-gray-600 p-5 h-28 shadow-lg max-w-4xl w-full space-y-4">
            <h2 className="font-bold text-base lg:text-2xl 2xl:text-3xl">
              {type.name}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HomePage;
