import type { ReactElement, RefObject } from 'react';
import {
  BLOSSOM_SWATCHES,
  SEASONS,
  SEASON_ORDER,
  type BlossomId,
  type SeasonId,
} from '../scene/palette';
import { SPECIES, SPECIES_ORDER, type SpeciesId } from '../scene/species';
import {
  BirchIcon,
  OakIcon,
  PalmIcon,
  PineIcon,
  ShareIcon,
  SoundOffIcon,
  SoundOnIcon,
  SpringIcon,
  SummerIcon,
  AutumnIcon,
  WinterIcon,
  WillowIcon,
} from './icons';

const SEASON_ICONS: Record<SeasonId, () => ReactElement> = {
  spring: SpringIcon,
  summer: SummerIcon,
  autumn: AutumnIcon,
  winter: WinterIcon,
};

const SPECIES_ICONS: Record<SpeciesId, () => ReactElement> = {
  oak: OakIcon,
  pine: PineIcon,
  willow: WillowIcon,
  birch: BirchIcon,
  palm: PalmIcon,
};

interface DockProps {
  dockRef: RefObject<HTMLDivElement | null>;
  draft: string;
  onDraftChange: (value: string) => void;
  toast: string | null;
  hint: string;
  onToggleMode: () => void;
  onShare: () => void;
  species: SpeciesId;
  onSpeciesChange: (id: SpeciesId) => void;
  season: SeasonId;
  onSeasonChange: (id: SeasonId) => void;
  blossom: BlossomId;
  onBlossomChange: (id: BlossomId) => void;
  muted: boolean;
  onToggleSound: () => void;
}

export function Dock({
  dockRef,
  draft,
  onDraftChange,
  toast,
  hint,
  onToggleMode,
  onShare,
  species,
  onSpeciesChange,
  season,
  onSeasonChange,
  blossom,
  onBlossomChange,
  muted,
  onToggleSound,
}: DockProps) {
  return (
    <div className="dock" ref={dockRef}>
      <div className="dock__toast-anchor">
        {toast && <div className="toast">{toast}</div>}
        <button className="hint" type="button" onClick={onToggleMode}>
          {hint}
        </button>
      </div>

      <div className="field">
        <input
          className="field__input"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Masukkan link disini (contoh: https://instagram.com/username)"
          aria-label="Link to encode"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <button
          className="field__action"
          type="button"
          onClick={onShare}
          aria-label="Share this tree"
        >
          <ShareIcon />
        </button>
      </div>

      <div className="trees">
        {SPECIES_ORDER.map((id) => {
          const Icon = SPECIES_ICONS[id];
          return (
            <button
              key={id}
              className="tree"
              type="button"
              title={SPECIES[id].label}
              aria-pressed={species === id}
              onClick={() => onSpeciesChange(id)}
            >
              <Icon />
              <span className="tree__label">{SPECIES[id].label}</span>
            </button>
          );
        })}
      </div>

      <div className="seasons">
        {SEASON_ORDER.map((id) => {
          const Icon = SEASON_ICONS[id];
          return (
            <button
              key={id}
              className="season"
              type="button"
              aria-pressed={season === id}
              onClick={() => onSeasonChange(id)}
            >
              <Icon />
              <span className="season__label">{SEASONS[id].label}</span>
            </button>
          );
        })}
        <button
          className="mute"
          type="button"
          aria-pressed={!muted}
          aria-label={muted ? 'Turn ambience on' : 'Turn ambience off'}
          onClick={onToggleSound}
        >
          {muted ? <SoundOffIcon /> : <SoundOnIcon />}
        </button>
      </div>

      <div className="blossoms">
        {season === 'spring' &&
          BLOSSOM_SWATCHES.map((s) => (
            <button
              key={s.id}
              className="blossom"
              type="button"
              aria-pressed={blossom === s.id}
              aria-label={`${s.label} blossom`}
              style={{ background: s.leaf[0] }}
              onClick={() => onBlossomChange(s.id)}
            />
          ))}
      </div>
    </div>
  );
}
