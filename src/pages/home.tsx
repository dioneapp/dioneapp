import Ad from "../components/home/ad";
import Explore from "../components/home/explore";
import Featured from "../components/home/featured";

export default function Home() {
  return (
    <div className="flex flex-col h-full w-full max-w-[2000px] mx-auto mt-6">
      <main className="flex-1 flex flex-col overflow-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <section className="w-full h-44 relative mt-6">
            <Ad />
          </section>
          <section className="flex flex-col min-h-0 flex-shrink-0 mt-6">
            <h1 className="text-2xl sm:text-3xl font-semibold py-4 sticky top-0 
                           backdrop-blur-sm z-10 px-2">
              Featured
            </h1>
            <div className="flex-1 overflow-auto pb-4 px-2">
              <Featured />
            </div>
          </section>
          
          <section className="flex flex-col min-h-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-semibold py-4 sticky top-0 
                           backdrop-blur-sm z-10 px-2">
              Explore
            </h1>
            <div className="flex-1 pb-4 px-2">
              <Explore />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
