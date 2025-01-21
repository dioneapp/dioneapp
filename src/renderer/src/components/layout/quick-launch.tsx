import { useEffect, useState } from "react"
import { getCurrentPort } from "@renderer/utils/getPort"
import { Link } from "react-router-dom"

export default function QuickLaunch() {
  const [installedApps, setInstalledApps] = useState<any[]>([])
  const [apps, setApps] = useState<any[]>([])
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
        src={app.logo_url || "/placeholder.svg"}
        alt={`${app.name} logo`}
        className="h-full scale-110 w-full"
      />
    </div>
      <p className="text-xs text-neutral-400">{app.name}</p>
    </Link>
  )

  const renderEmptyButton = (index: number) => (
    <button key={index} className="flex flex-col justify-center items-center rounded-xl gap-2 w-full h-full">
    <div className="h-20 w-20 border border-white/10 object-fill rounded-xl flex items-center justify-center">
    <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
    </div>
    <p className="text-xs text-neutral-400">Add App</p>
    </button>
  )

  return (
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
  )
}

