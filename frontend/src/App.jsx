import { useEffect, useState } from 'react'
import { createDeployment, getDeploymentStatus } from './services/api'

const TERMINAL_STATUSES = new Set(['Success', 'Failed'])

function mapStatus(rawStatus) {
  if (rawStatus === 'Success') {
    return 'Success'
  }

  if (rawStatus === 'Failed') {
    return 'Failed'
  }

  return 'Deploying'
}

function App() {
  const [repoUrl, setRepoUrl] = useState('')
  const [deploymentId, setDeploymentId] = useState(null)
  const [status, setStatus] = useState('Idle')
  const [stack, setStack] = useState('-')
  const [liveUrl, setLiveUrl] = useState('-')
  const [isDeploying, setIsDeploying] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!deploymentId || TERMINAL_STATUSES.has(status)) {
      return undefined
    }

    const intervalId = setInterval(async () => {
      try {
        const latest = await getDeploymentStatus(deploymentId)
        const nextStatus = mapStatus(latest.status)

        setStatus(nextStatus)
        setStack(latest.stack || '-')
        setLiveUrl(latest.url || '-')

        if (TERMINAL_STATUSES.has(nextStatus)) {
          setIsDeploying(false)
        }
      } catch (error) {
        setStatus('Failed')
        setIsDeploying(false)
        setErrorMessage(error.message || 'Unable to fetch deployment status.')
      }
    }, 1300)

    return () => clearInterval(intervalId)
  }, [deploymentId, status])

  async function handleDeploy(event) {
    event.preventDefault()

    if (!repoUrl.trim()) {
      setErrorMessage('Please enter a GitHub repository URL.')
      return
    }

    try {
      setIsDeploying(true)
      setStatus('Deploying')
      setStack('-')
      setLiveUrl('-')
      setErrorMessage('')

      const deployment = await createDeployment(repoUrl.trim())

      setDeploymentId(deployment.id)
      setStatus(mapStatus(deployment.status))
      setStack(deployment.stack || '-')
      setLiveUrl(deployment.url || '-')
    } catch (error) {
      setIsDeploying(false)
      setStatus('Failed')
      setErrorMessage(error.message || 'Deployment request failed.')
    }
  }

  const statusStyles = {
    Idle: 'bg-slate-700/60 text-slate-200 ring-slate-400/40',
    Deploying: 'bg-amber-500/15 text-amber-300 ring-amber-400/40',
    Success: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40',
    Failed: 'bg-rose-500/15 text-rose-300 ring-rose-400/40',
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient px-4 py-12 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-fuchsia-600/30 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
      </div>

      <section className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-6 shadow-card backdrop-blur-xl sm:p-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">CloudOps Deploy</h1>
          <p className="text-sm text-slate-200 sm:text-base">Zero-config CI/CD platform</p>
        </header>

        <form onSubmit={handleDeploy} className="mt-8 space-y-4">
          <input
            type="url"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="Enter GitHub repo URL"
            className="w-full rounded-2xl border border-white/20 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none ring-0 transition focus:border-indigo-300/50 focus:bg-slate-950/60"
          />

          <button
            type="submit"
            disabled={isDeploying}
            className={`w-full rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 disabled:cursor-not-allowed disabled:opacity-70 ${isDeploying ? 'animate-pulseGlow' : ''}`}
          >
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/35 px-4 py-3">
          <span className="text-sm text-slate-300">Status</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusStyles[status] || statusStyles.Idle}`}
          >
            {status}
          </span>
        </div>

        <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-slate-900/35 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-300">Detected Stack</span>
            <span className="text-sm font-medium text-white">{stack}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-300">Deployment URL</span>
            {liveUrl !== '-' ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="max-w-[65%] truncate text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                {liveUrl}
              </a>
            ) : (
              <span className="text-sm font-medium text-white">-</span>
            )}
          </div>
        </div>

        {errorMessage ? <p className="mt-4 text-sm text-rose-300">{errorMessage}</p> : null}
      </section>
    </main>
  )
}

export default App
