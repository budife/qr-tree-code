import type { ViewMode } from '../scene';

interface WeatherControlsProps {
  mode: ViewMode;
  rainOn: boolean;
  fireOn: boolean;
  fireLocked: boolean;
  onToggleRain: () => void;
  onFireClick: () => void;
}

export function WeatherControls({
  mode,
  rainOn,
  fireOn,
  fireLocked,
  onToggleRain,
  onFireClick,
}: WeatherControlsProps) {
  return (
    /* Weather only applies to the tree view, so the toggle fades out with it. */
    <div
      className={`weather-controls${mode === 'code' ? ' weather-controls--hidden' : ''}`}
      role="group"
      aria-label="Cuaca"
    >
      <button
        className="weather"
        type="button"
        title="Hujan"
        aria-label="Hujan"
        aria-pressed={rainOn}
        onClick={onToggleRain}
      >
        <span aria-hidden="true">🌧</span>
      </button>
      <button
        className="weather"
        type="button"
        aria-label="Kebakaran"
        aria-pressed={fireOn}
        aria-disabled={fireLocked}
        onClick={onFireClick}
      >
        <span aria-hidden="true">🔥</span>
      </button>
    </div>
  );
}
