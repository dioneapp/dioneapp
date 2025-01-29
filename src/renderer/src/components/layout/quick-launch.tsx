import { getCurrentPort } from "@renderer/utils/getPort"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "../../assets/svgs/Close.svg";

export default function QuickLaunch() {
  const [installedApps, setInstalledApps] = useState<string[]>([])
  const [apps, setApps] = useState<any[]>([])
  const [showAppList, setShowAppList] = useState<boolean>(false)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [availableApps, setAvailableApps] = useState<any[]>([])
  const maxApps = 6
  const localStorageKey = 'quickLaunchApps';

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { scale: 0.95, opacity: 0 }
  };

  const appItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 }
    })
  }

  useEffect(() => {
    const savedApps = localStorage.getItem(localStorageKey);
    if (savedApps) {
      setApps(JSON.parse(savedApps));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    async function getInstalledApps() {
      try {
        const port = await getCurrentPort()
        const response = await fetch(`http://localhost:${port}/installed`)
        if (!response.ok) return
        const data = await response.json()
        setInstalledApps(data.apps || [])
      } catch (error) {
        console.error("Error fetching installed apps:", error)
      }
    }
    getInstalledApps()
  }, [])

  useEffect(() => {
    async function loadQuickLaunchApps() {
      try {
        const port = await getCurrentPort()
        const results = await Promise.all(
          installedApps.slice(0, maxApps).map(app =>
            fetch(`http://localhost:${port}/search_name/${app}`)
              .then(res => res.ok ? res.json() : [])
          )
        )
        if (!localStorage.getItem(localStorageKey)) {
          setApps(results.flat().slice(0, maxApps))
        }
      } catch (error) {
        console.error("Error loading apps:", error)
      }
    }
    if (installedApps.length) loadQuickLaunchApps()
  }, [installedApps])

  async function showAppSelector(index: number) {
    try {
      const port = await getCurrentPort()
      const results = await Promise.all(
        installedApps.map(app =>
          fetch(`http://localhost:${port}/search_name/${app}`)
            .then(res => res.ok ? res.json() : [])
        )
      )
      setAvailableApps(results.flat())
      setSelectedSlot(index)
      setShowAppList(true)
    } catch (error) {
      console.error("Error fetching apps:", error)
    }
  }

  function addToSlot(app: any) {
    if (selectedSlot === null) return
    const newApps = [...apps]
    newApps[selectedSlot] = app
    setApps(newApps)
    setShowAppList(false)
    setSelectedSlot(null)
  }

  const removeApp = (index: number) => {
    const newApps = [...apps];
    newApps[index] = null;
    setApps(newApps);
  };

  const renderAppButton = (app: any, index: number) => (
    <Link
      to={`/install/${app.id}`}
      key={index}
      className="flex flex-col items-center gap-1"
    >
      <div
        className="h-18 w-18 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden"
        onContextMenu={(e) => {
          e.preventDefault();
          removeApp(index);
        }}
      >
        <img
          src={app.logo_url || "/svgs/placeholder.svg"}
          alt={app.name}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="text-xs text-neutral-400">{app.name}</p>
    </Link>
  )

  const renderEmptyButton = (index: number) => (
    <button
      onClick={() => showAppSelector(index)}
      className="flex flex-col items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={installedApps.length === 0}
    >
      <div className="h-18 w-18 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer">
        <svg className="w-10 h-10 hover:rotate-90 transition-transform"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="#FFFFFF"
        >
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      </div>
      <p className="text-xs text-neutral-400">Add App</p>
    </button>
  )

  return (
    <div className="flex mt-auto w-full h-64">
      <div className="w-full">
        <h2 className="font-semibold">Quick Launch</h2>
        <div className="grid grid-cols-3 my-4 gap-2">
          {Array(maxApps).fill(null).map((_, index) =>
            apps[index] ? renderAppButton(apps[index], index) : renderEmptyButton(index)
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAppList && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-xl z-50 flex items-center justify-center"
            onClick={() => setShowAppList(false)}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-xl w-full backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="absolute top-0 left-0.5/4 w-32 h-32 bg-[#BCB1E7] rounded-full -translate-y-1/2 blur-3xl z-10" />

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-col gap-2 items-center">
                    <h3 className="text-lg font-semibold">Select an App</h3>
                    <p className="text-xs text-neutral-400">
                      {availableApps.length} apps are available. You can choose up to {maxApps}.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAppList(false)}
                    className="px-2 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 text-sm font-medium whitespace-nowrap cursor-pointer"
                  >
                    <img src={CloseIcon} alt="Close App" className="h-3 w-3" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto mt-4">
                  {availableApps.map((app, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={appItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <button
                        onClick={() => addToSlot(app)}
                        className="flex flex-col items-center p-3 rounded-xl transition-colors w-full cursor-pointer"
                      >
                        <motion.div
                          className="h-16 w-16 mb-2 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={app.logo_url || "/svgs/placeholder.svg"}
                            alt={app.name}
                            className="h-full w-full object-cover"
                          />
                        </motion.div>
                        <span className="text-xs text-neutral-400">{app.name}</span>
                      </button>
                    </motion.div>
                  ))}                   
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
