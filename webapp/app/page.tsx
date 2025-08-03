import Image from "next/image";

export default function Home() {
  return (
    <>
    <div className="h-screen">
      <div className="flex justify-between h-5 p-10 font-bold text-3xl mx-10">
        <h1>MOLIYAL AI</h1>
        <h1>BETA</h1>
      </div>
      <div className="flex text-center w-full justify-around mt-30">
        <div className="border-2 py-2 px-5 text-3xl rounded-xl border-b-blue-700 border-t-blue-700 border-s">In Just Few Clicks</div>
      </div>
      <div className="text-center p-10 text-7xl font-bold">Make Your Website Talk!</div>
      <div className="flex justify-around">
          <img src={"/land_page/sphere.svg"} className="absolute z-10 justify-center"></img>
      </div>
      <img src={"/land_page/hero_background.svg"} className="mt-15 w-full absolute"></img>
    </div>
    </>
  );
}
