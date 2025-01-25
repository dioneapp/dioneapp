import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./pages/loading";
import Titlebar from "./components/layout/titlebar";
import Home from "./pages/home";
import Sidebar from "./components/layout/sidebar";
import Install from "./pages/install";
import Settings from "./pages/settings";
import { ToastProvider } from "./utils/useToast";

function App() {
  const { pathname } = useLocation();

  return (
    <ToastProvider>
    <div className="h-screen w-screen">
      <Titlebar />
      <div className="flex h-full">
        <Sidebar />
        <div className={`flex-1 mt-6 ${pathname === '/' ? 'overflow-auto' : 'overflow-hidden'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loading" element={<Loading />}/>
            <Route path="/install/:id" element={<Install />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
    </ToastProvider>
  );
}

export default App;
