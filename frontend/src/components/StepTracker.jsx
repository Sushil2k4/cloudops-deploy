const STEP_LABELS = {
  completed: 'Completed',
  active: 'In progress',
  pending: 'Pending',
  failed: 'Failed',
}

function StepTracker({ steps, activeStep, status }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Deployment Steps</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Pipeline</span>
      </div>

      <ol className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep && status !== 'Failed'
          const isActive = index === activeStep
          const isFailed = status === 'Failed' && isActive

          let state = 'pending'
          if (isFailed) {
            state = 'failed'
          } else if (isCompleted) {
            state = 'completed'
          } else if (isActive) {
            state = 'active'
          }

          const stateStyles = {
            completed: 'border-emerald-300/35 bg-emerald-500/15 text-emerald-200',
            active: 'border-indigo-300/40 bg-indigo-500/15 text-indigo-100',
            pending: 'border-white/10 bg-slate-900/40 text-slate-300',
            failed: 'border-rose-300/35 bg-rose-500/15 text-rose-100',
          }

          return (
            <li
              key={step}
              className={`group flex items-center gap-3 rounded-2xl border px-3 py-2 transition-all duration-300 ${stateStyles[state]}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  state === 'completed'
                    ? 'border-emerald-300/35 bg-emerald-500/25 text-emerald-100'
                    : state === 'active'
                      ? 'border-indigo-300/35 bg-indigo-500/30 text-indigo-100'
                      : state === 'failed'
                        ? 'border-rose-300/35 bg-rose-500/30 text-rose-100'
                        : 'border-white/10 bg-slate-950/60 text-slate-300'
                }`}
              >
                {index + 1}
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <p className="truncate text-sm font-medium">{step}</p>
                <span className="text-[10px] uppercase tracking-[0.14em] text-slate-300/90">
                  {STEP_LABELS[state]}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default StepTracker
