import { Route, Routes} from "react-router";
import Loading from "./pages/loading";
import Titlebar from "./components/layout/titlebar";
import Home from "./pages/home";
import Sidebar from "./components/layout/sidebar";

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Titlebar />
      <div className="flex">
      <Sidebar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/loading" element={<Loading />} />
      </Routes>
      </div>
    </div>
  )
}

export default App
