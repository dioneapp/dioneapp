import Ad from "../components/home/ad";
import Explore from "../components/home/explore";
import Featured from "../components/home/featured";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <main className="flex flex-col gap-8 py-6">
          
          {/* <section className="w-full h-24">
            <Ad />
          </section> */}

          {/* featured section */}
          <section className="relative">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-4">
              Featured
            </h1>
            <div className="w-full">
              <Featured />
            </div>
          </section>
          
          {/* explore section */}
          <section className="relative">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-4">
              Explore
            </h1>
            <div className="w-full">
              <Explore />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}