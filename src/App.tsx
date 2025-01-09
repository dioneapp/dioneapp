import { Route, Routes} from "react-router";
import Loading from "./pages/loading";
import Titlebar from "./components/layout/titlebar";

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Titlebar />
      <Routes>
      <Route path="/loading" element={<Loading />} />
      </Routes>
    </div>
  )
}

export default App
