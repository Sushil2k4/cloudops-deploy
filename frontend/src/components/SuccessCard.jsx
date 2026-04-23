import { useState } from 'react'

function SuccessCard({ url }) {
  const [isCopied, setIsCopied] = useState(false)

  async function handleCopyUrl() {
    if (!url || typeof navigator === 'undefined' || !navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(url)
    setIsCopied(true)

    window.setTimeout(() => {
      setIsCopied(false)
    }, 1600)
  }

  return (
    <section className="animate-fadeSlide rounded-3xl border border-emerald-300/35 bg-emerald-500/15 p-5 shadow-glow-emerald backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Deployment Complete</p>
      <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Your app is now live.</h2>
      <p className="mt-3 truncate text-sm text-emerald-100/95">{url}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
        >
          Open App
        </a>

        <button
          type="button"
          onClick={handleCopyUrl}
          className="rounded-xl border border-emerald-200/50 bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-300/30"
        >
          {isCopied ? 'Copied!' : 'Copy URL'}
        </button>
      </div>
    </section>
  )
}

export default SuccessCard
