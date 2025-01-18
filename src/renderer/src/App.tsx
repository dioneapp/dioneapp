import { Route, Routes } from "react-router-dom";
import Loading from "./pages/loading";
import Titlebar from "./components/layout/titlebar";
import Home from "./pages/home";
import Sidebar from "./components/layout/sidebar";
import Install from "./pages/install";

function App() {
  return (
    <div className="h-screen w-screen">
      <Titlebar />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 overflow-auto mt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/install/:id" element={<Install />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
