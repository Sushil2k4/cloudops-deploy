import { useEffect, useMemo, useState } from 'react'
import { createDeployment, getDeploymentStatus } from './services/api'
import StepTracker from './components/StepTracker'
import TerminalLogsPanel from './components/TerminalLogsPanel'
import SuccessCard from './components/SuccessCard'

const TERMINAL_STATUSES = new Set(['Success', 'Failed'])
const DEPLOYMENT_STEPS = ['Clone Repo', 'Build Image', 'Run Container', 'Live']

function mapStatus(rawStatus) {
  if (rawStatus === 'Success') {
    return 'Success'
  }

  if (rawStatus === 'Failed') {
    return 'Failed'
  }

  if (rawStatus === 'Building') {
    return 'Building'
  }

  return 'Deploying'
}

function resolveStepIndex(status, logs) {
  if (status === 'Idle') {
    return -1
  }

  if (status === 'Success') {
    return 3
  }

  const mergedLogs = logs.join(' ').toLowerCase()

  if (mergedLogs.includes('container running') || mergedLogs.includes('starting container')) {
    return 2
  }

  if (mergedLogs.includes('build') || mergedLogs.includes('dockerfile')) {
    return 1
  }

  if (mergedLogs.includes('clone') || mergedLogs.includes('repository')) {
    return 0
  }

  if (status === 'Building') {
    return 1
  }

  if (status === 'Deploying' || status === 'Failed') {
    return 2
  }

  return 0
}

function App() {
  const [repoUrl, setRepoUrl] = useState('')
  const [deploymentId, setDeploymentId] = useState(null)
  const [status, setStatus] = useState('Idle')
  const [stack, setStack] = useState('-')
  const [liveUrl, setLiveUrl] = useState('-')
  const [logs, setLogs] = useState([])
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
        setLogs(Array.isArray(latest.logs) ? latest.logs : [])

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
      setStatus('Building')
      setStack('-')
      setLiveUrl('-')
      setLogs([])
      setErrorMessage('')

      const deployment = await createDeployment(repoUrl.trim())

      setDeploymentId(deployment.id)
      setStatus(mapStatus(deployment.status))
      setStack(deployment.stack || '-')
      setLiveUrl(deployment.url || '-')
      setLogs(Array.isArray(deployment.logs) ? deployment.logs : [])
    } catch (error) {
      setIsDeploying(false)
      setStatus('Failed')
      setErrorMessage(error.message || 'Deployment request failed.')
    }
  }

  const statusStyles = {
    Idle: 'bg-slate-700/60 text-slate-200 ring-slate-400/40',
    Building: 'bg-violet-500/15 text-violet-200 ring-violet-400/40',
    Deploying: 'bg-amber-500/15 text-amber-300 ring-amber-400/40',
    Success: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40',
    Failed: 'bg-rose-500/15 text-rose-300 ring-rose-400/40',
  }

  const activeStep = useMemo(() => resolveStepIndex(status, logs), [status, logs])

  return (
    <main className="relative min-h-screen overflow-hidden bg-hero-gradient px-4 py-10 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-card backdrop-blur-2xl sm:p-8">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-200/80">CloudOps Deploy</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">DevOps Dashboard</h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">Monitor every deployment stage in real time.</p>
          </div>
          <span className={`self-start rounded-full px-3 py-1 text-xs font-medium ring-1 sm:self-auto ${statusStyles[status] || statusStyles.Idle}`}>
            {status}
          </span>
        </header>

        <form onSubmit={handleDeploy} className="mb-6 rounded-3xl border border-white/10 bg-slate-950/30 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/user/repo"
              className="w-full rounded-2xl border border-white/20 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-300/50"
            />
            <button
              type="submit"
              disabled={isDeploying}
              className={`rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 disabled:cursor-not-allowed disabled:opacity-70 ${isDeploying ? 'animate-pulseGlow' : ''}`}
            >
              {isDeploying ? 'Deploying...' : 'Deploy'}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-400">Stack:</span>
              <span className="font-medium text-white">{stack}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-400">URL:</span>
              {liveUrl !== '-' ? (
                <a href={liveUrl} target="_blank" rel="noreferrer" className="max-w-64 truncate font-medium text-cyan-300 hover:text-cyan-200">
                  {liveUrl}
                </a>
              ) : (
                <span className="font-medium text-white">-</span>
              )}
            </div>
          </div>
        </form>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.35fr]">
          <StepTracker steps={DEPLOYMENT_STEPS} activeStep={activeStep} status={status} />
          <TerminalLogsPanel logs={logs} status={status} />
        </div>

        {status === 'Success' && liveUrl !== '-' ? <div className="mt-5"><SuccessCard url={liveUrl} /></div> : null}

        {errorMessage ? <p className="mt-4 text-sm text-rose-300">{errorMessage}</p> : null}
      </section>
    </main>
  )
}

export default App