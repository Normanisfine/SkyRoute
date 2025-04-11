import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Welcome to SkyRoute</h1>
        <p className="text-xl text-gray-600 mt-4">Your one-stop solution for booking flights worldwide</p>
        <div className="mt-12">
          <button className="bg-gray-900 text-white py-3 px-12 rounded-md text-lg font-medium">
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
