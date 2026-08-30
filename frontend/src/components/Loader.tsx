import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import './Loader.css'

type LoaderProps = {
  label?: string
  size?: number
}

const LOADER_ANIMATION_URL =
  'https://lottie.host/dc547e39-c6c4-4bb0-89de-1758d18e7eff/QKk6Oqy0xs.lottie'

export function Loader({
  label = 'Loading...',
  size = 80,
}: LoaderProps) {
  return (
    <div className="qb-loader" role="status" aria-live="polite">
      <div
        className="qb-loader__animation"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <DotLottieReact
          src={LOADER_ANIMATION_URL}
          loop
          autoplay
        />
      </div>

      <span className="qb-loader__label">{label}</span>
    </div>
  )
}