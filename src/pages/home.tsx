import Explore from "../components/home/explore";

export default function Home() {
  return (
    <div className="flex flex-col items-start justify-start p-8 h-screen w-screen">
      <h1 className="text-3xl font-bold">Featured</h1>
      <Explore />
    </div>
  )
}