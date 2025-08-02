import { getCurrentPort } from "@renderer/utils/getPort"
import { useEffect, useState } from "react"
import { X, Copy, Search, Check } from "lucide-react"
import { useToast } from "@renderer/utils/useToast"
import { motion } from "framer-motion"

interface Variable {
  [key: string]: any
}

export default function VariablesModal({ onClose }: { onClose: () => void }) {
  const [variables, setVariables] = useState<Variable>({})
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})
  const [searchTerm, setSearchTerm] = useState("")
  const { addToast } = useToast();
    const showToast = (
        variant: "default" | "success" | "error" | "warning",
        message: string,
        fixed?: "true" | "false",
        button?: boolean,
        buttonText?: string,
        buttonAction?: () => void,
        removeAfter?: number,
    ) => {
        addToast({
            variant,
            children: message,
            fixed,
            button,
            buttonText,
            buttonAction,
            removeAfter,
        });
    };

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const port = await getCurrentPort()
        const response = await fetch(`http://localhost:${port}/variables`)
        const data = await response.json()
        setVariables(data)
      } catch (error) {
        console.error("Failed to fetch variables:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchVariables()
  }, [])

  // shortcut to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleCopy = async (key: any, value?: any) => {
    try {
      if (!value) {
          value = variables;
      }
        await navigator.clipboard.writeText(JSON.stringify(value, null, 2))
        showToast("success", "Copied to clipboard!")
        setCopied({ [key]: true })
        setTimeout(() => setCopied({ [key]: false }), 1000)
      } catch (error) {
        console.error("Failed to copy:", error)
      }
  }

    // check if a variable is a PATH-like variable
    const isPathVariable = (key: string, value: any): boolean => {
        if (typeof value !== "string") return false

        // path-like variable names
        const pathVariableNames = [
        "PATH",
        "CLASSPATH",
        "PYTHONPATH",
        "NODE_PATH",
        "LD_LIBRARY_PATH",
        "DYLD_LIBRARY_PATH",
        "PKG_CONFIG_PATH",
        "CMAKE_PREFIX_PATH",
        ]
        if (pathVariableNames.some((pathKey) => key.toUpperCase() === pathKey)) {
        return true
        }
        const delimiter = value.includes(";") ? ";" : ":"
        const parts = value.split(delimiter).filter((part) => part.trim() !== "")

        if (parts.length >= 3 && value.length > 50) {
        const pathLikeParts = parts.filter((part) => {
            const trimmed = part.trim()
            // check if looks like a path
            return (
            trimmed.includes("/") ||
            trimmed.includes("\\") ||
            trimmed.match(/^[A-Za-z]:[\\/]/) ||
            trimmed.startsWith("/")
            )
        })
        return pathLikeParts.length >= parts.length * 0.7
        }

        return false
    }

  // format path-like variables
  const formatPathVariable = (value: string): string[] => {
    // delimiter (windows ;, unix :)
    const delimiter = value.includes(";") ? ";" : ":"
    return value.split(delimiter).filter((path) => path.trim() !== "")
  }

  // filtered search
  const filteredVariables = searchTerm
    ? Object.fromEntries(
        Object.entries(variables).filter(
          ([key, value]) =>
            key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    : variables

  const renderVariableValue = (key: string, value: any) => {
    if (typeof value === "string" && isPathVariable(key, value)) {
      const paths = formatPathVariable(value)
      return (
        <div className="space-y-1">
          {paths.map((path, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <span className="text-neutral-500 text-xs w-6 flex-shrink-0">{index + 1}.</span>
              <code className="flex-1 text-sm bg-white/5 px-2 py-1 rounded border border-white/10 break-all">
                {path}
              </code>
              <button
                onClick={() => handleCopy(index + 1, path)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-neutral-400 hover:text-white transition-all flex-shrink-0"
                title="Copy path"
              >
                {copied[index + 1] ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          ))}
        </div>
      )
    }

    if (typeof value === "string") {
      return <span className="break-all">{value}</span>
    }

    return <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
  }

  return (
    <motion.div
      id="modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center p-4 justify-center overflow-hidden"
      style={{ isolation: 'isolate', willChange: 'backdrop-filter' }}
      onClick={onClose}
      onWheel={(e) => e.preventDefault()}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div
        className="bg-neutral-900 rounded-xl max-w-5xl xl:max-w-7xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">Environment Variables</h2>
            <span className="text-sm text-neutral-400 bg-white/10 px-2 py-1 rounded-full">
              {Object.keys(filteredVariables).length} variables
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy("general")}
              className="p-2 hover:text-white rounded-lg transition-colors text-neutral-400"
              title="Copy all to clipboard"
            >
              {copied["general"] ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search variables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/5 text-white placeholder-neutral-400 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BCB1E7] focus:border-[#BCB1E7]/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(filteredVariables).map(([key, value]) => (
                <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-[#BCB1E7]">{key}</h3>
                    </div>
                    <button
                      onClick={() => handleCopy(key, value)}
                      className="p-1 rounded text-neutral-400 hover:text-white flex-shrink-0"
                      title="Copy full value"
                    >
                      {copied[key] ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm text-neutral-300 font-mono">{renderVariableValue(key, value)}</div>
                </div>
              ))}
              {Object.keys(filteredVariables).length === 0 && searchTerm && (
                <div className="text-center text-neutral-400 py-8">No variables found matching "{searchTerm}"</div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
