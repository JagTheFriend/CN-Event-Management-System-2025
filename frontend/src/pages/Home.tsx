import { Vortex } from "@/components/ui/vortex";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full mx-auto h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={1200}
        particleCount={1800}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-4xl font-bold text-center">
          Welcome to CN Event Management System
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Plan Less. Achieve More — with AI
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link to="/events" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            Browse Events &raquo;
          </Link>
        </div>
      </Vortex>
    </div>
  );
}
