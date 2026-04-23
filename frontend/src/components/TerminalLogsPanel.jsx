import { useEffect, useRef } from 'react'

function TerminalLogsPanel({ logs, status }) {
  const logContainerRef = useRef(null)

  useEffect(() => {
    const el = logContainerRef.current
    if (!el) {
      return
    }

    el.scrollTop = el.scrollHeight
  }, [logs])

  const statusTone =
    status === 'Failed'
      ? 'text-rose-300'
      : status === 'Success'
        ? 'text-emerald-300'
        : 'text-cyan-300'

  const rows = logs.length > 0 ? logs : ['Waiting for deployment logs...']

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Live Logs</h2>
        <span className={`text-xs uppercase tracking-[0.2em] ${statusTone}`}>{status}</span>
      </div>

      <div
        ref={logContainerRef}
        className="terminal-scroll h-72 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/90 p-3 font-mono text-xs text-slate-100 shadow-inner shadow-black/40"
      >
        {rows.map((line, index) => (
          <p key={`${line}-${index}`} className="whitespace-pre-wrap break-words leading-6">
            <span className="mr-3 text-slate-500">{String(index + 1).padStart(2, '0')}</span>
            <span>{line}</span>
          </p>
        ))}
      </div>
    </section>
  )
}

export default TerminalLogsPanel
