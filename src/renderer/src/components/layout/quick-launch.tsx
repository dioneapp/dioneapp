import { getCurrentPort } from "@renderer/utils/getPort"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function QuickLaunch() {
  const [installedApps, setInstalledApps] = useState<any[]>([])
  const [apps, setApps] = useState<any[]>([])
  const [showTutorial, setShowTutorial] = useState<boolean>(false)
  const maxApps = 6

  useEffect(() => {
    async function getInstalledApps() {
      try {
        const port = await getCurrentPort()
        const response = await fetch(`http://localhost:${port}/installed`)
        if (!response.ok) {
          setInstalledApps([])
          return
        }
        const data = await response.json()
        if (data) {
          setInstalledApps(data.apps)
        } else {
          setInstalledApps([])
        }
      } catch (error) {
        console.error("Error fetching installed apps:", error)
        setInstalledApps([])
      }
    }
    getInstalledApps()
  }, [])

  useEffect(() => {
    if (installedApps.length > 0) {
      async function getApps() {
        try {
          const port = await getCurrentPort()
          const fetchPromises = installedApps.map((app) => fetch(`http://localhost:${port}/search_name/${app}`))

          const responses = await Promise.all(fetchPromises)
          const dataPromises = responses.map((response) => {
            if (!response.ok) {
              return []
            }
            return response.json()
          })

          const dataArrays = await Promise.all(dataPromises)
          const allApps = dataArrays.flat().slice(0, maxApps)
          setApps(allApps)
        } catch (error) {
          console.error("Error fetching apps:", error)
          setApps([])
        }
      }
      getApps()
    }
  }, [installedApps])

  const renderAppButton = (app: any, index: number) => (
    <Link to={`/install/${app.id}`} key={index} className="flex flex-col justify-center items-center rounded-xl gap-2 w-full h-full">
      <div className="h-20 w-20 border border-white/10 object-fill rounded-xl flex items-center justify-center overflow-hidden">
        <img
          src={app.logo_url || "/svgs/placeholder.svg"}
          alt={`${app.name} logo`}
          className="h-full scale-110 w-full"
        />
      </div>
      <p className="text-xs text-neutral-400">{app.name}</p>
    </Link>
  )

  const renderEmptyButton = (index: number) => (
    <button onClick={() => setShowTutorial(!showTutorial)} key={index} className="flex flex-col justify-center items-center rounded-xl gap-2 w-full h-full">
      <div className="h-20 w-20 border border-white/10 object-fill rounded-xl flex items-center justify-center">
        <svg className="w-10 h-10 hover:rotate-90 duration-300 transition-all" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
      </div>
      <p className="text-xs text-neutral-400">Add App</p>
    </button>
  )

  return (
    <>
      <div className="flex mt-auto w-full h-64">
        <div className="w-full">
          <h2 className="font-semibold">Quick Launch</h2>
          <div className="grid grid-cols-3 gap-2 my-4">
            {Array(maxApps)
              .fill(null)
              .map((_, index) => (apps[index] ? renderAppButton(apps[index], index) : renderEmptyButton(index)))}
          </div>
        </div>
      </div>
      {showTutorial && (
        <div onClick={() => setShowTutorial(false)} className="absolute inset-0 w-full h-full bg-black/50 backdrop-blur-xl z-10">
          <div className="flex justify-center items-center w-full h-full max-w-6xl mx-auto">
            <div className="w-full h-full p-4">
              <div className="bg-white/10 rounded-xl backdrop-blur-3xl w-full h-full relative flex flex-col justify-center items-end">
                <div className="absolute top-4 right-4">
                  <span className="text-xs text-neutral-300 hover:bg-white/20 cursor-pointer bg-white/10 rounded-full px-4 py-2">Close</span>
                </div>
                <div className="grid grid-rows-12 w-full h-full">
                  <div className="flex justify-center items-center mt-24">
                    <h1>no se que es esto pero ya se nos ocurrira algo</h1>
                  </div>
                  <div className="row-span-11 flex w-full h-full justify-center gap-12 items-end overflow-hidden">
                    <div className="h-2/3 w-80 -mb-24 -rotate-12 bg-black/50 border border-white/20 rounded-t-xl hover:-mb-16 transition-all duration-500"></div>
                    <div className="h-2/3 w-80 -mb-12 bg-black/50 border border-white/20  z-50 rounded-xl hover:mb-8 hover:mx-4 transition-all duration-500"></div>
                    <div className="h-2/3 w-80 -mb-24 rotate-12 bg-black/50 rounded-t-xl border border-white/20 hover:-mb-16 transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

