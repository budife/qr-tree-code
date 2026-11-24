import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ViewMode } from './scene';
import {
  type SeasonId,
  type BlossomId,
} from './scene/palette';
import { SPECIES, type SpeciesId } from './scene/species';
import { Ambience } from './audio/ambience';
import { DEFAULT_URL, normalizeLink } from './lib/url';
import { sceneErrorMessage } from './lib/sceneStatus';
import { currentSeason } from './lib/season';
import { resolvePalette } from './lib/palette';
import { InfoPanel } from './ui/InfoPanel';
import { WeatherControls } from './ui/WeatherControls';
import { Dock } from './ui/Dock';
import { AboutModal } from './ui/AboutModal';
import './styles.css';
import './modal.css';

/** Debounce regrowing the tree so it does not thrash on every keystroke. */
const REBUILD_DELAY = 500;

/** Get random tree species. */
function getRandomSpecies(): SpeciesId {
  const species = ['oak', 'pine', 'willow', 'birch', 'palm'] as const;
  return species[Math.floor(Math.random() * species.length)];
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<import('./scene').QrTreeScene | null>(null);
  const ambienceRef = useRef<Ambience | null>(null);

  const [draft, setDraft] = useState('');
  const [committed, setCommitted] = useState(DEFAULT_URL); // start with default to avoid empty→default rebuild
  const [season, setSeason] = useState<SeasonId>(currentSeason());
  const [species, setSpecies] = useState<SpeciesId>(getRandomSpecies());
  const [weather, setWeather] = useState<'clear' | 'rain'>('clear');
  const [fireOn, setFireOn] = useState(false); // fire button state independent of weather
  const [fireLocked, setFireLocked] = useState(false); // fire cannot be turned off once on (except by rain)
  const [blossom, setBlossom] = useState<BlossomId>('blush');
  const [mode, setMode] = useState<ViewMode>('tree');
  const [muted, setMuted] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [sceneError, setSceneError] = useState<string | null>(null);

  const palette = useMemo(() => resolvePalette(season, blossom), [season, blossom]);

  // The scene loads in a separate chunk; keep the latest config for when it arrives.
  const sceneConfigRef = useRef({ palette, committed, mode, species, weather, fireOn });
  useEffect(() => {
    sceneConfigRef.current = { palette, committed, mode, species, weather, fireOn };
  });

  // ---- scene lifecycle ---------------------------------------------------

  useEffect(() => {
    if (!canvasRef.current) return;
    let cancelled = false;
    let scene: import('./scene').QrTreeScene | null = null;
    let ro: ResizeObserver | null = null;
    const onResize = () => scene?.resize();

    void (async () => {
      try {
        const { QrTreeScene } = await import('./scene');
        if (cancelled || !canvasRef.current) return;

        const cfg = sceneConfigRef.current;
        scene = new QrTreeScene(canvasRef.current, cfg.committed, cfg.palette, SPECIES[cfg.species]);
        sceneRef.current = scene;
        scene.setMode(cfg.mode);
        scene.setWeather(cfg.fireOn ? 'fire' : 'clear');
        scene.setRain(cfg.weather === 'rain');
        const dock = dockRef.current;
        if (dock) scene.setDockHeight(dock.getBoundingClientRect().height);

        window.addEventListener('orientationchange', onResize);
        ro = new ResizeObserver(onResize);
        ro.observe(canvasRef.current);
      } catch (error) {
        if (!cancelled) setSceneError(sceneErrorMessage(error));
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener('orientationchange', onResize);
      ro?.disconnect();
      scene?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setPalette(palette);
  }, [palette]);

  useEffect(() => {
    sceneRef.current?.setText(committed);
  }, [committed]);

  useEffect(() => {
    sceneRef.current?.setMode(mode);
  }, [mode]);

  useEffect(() => {
    sceneRef.current?.setSpecies(species);
  }, [species]);

  useEffect(() => {
    // Rain and fire are independent: both can be active at the same time.
    sceneRef.current?.setWeather(fireOn ? 'fire' : 'clear');
    sceneRef.current?.setRain(weather === 'rain');
  }, [weather, fireOn]);

  // Report the dock's real height so the code is never framed underneath it.
  useEffect(() => {
    const el = dockRef.current;
    if (!el) return;
    const report = () => sceneRef.current?.setDockHeight(el.getBoundingClientRect().height);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Flush the typed link immediately on Enter, blur and Share. The debounce
  // below stays as a background fallback for users who just keep typing.
  const commitDraft = useCallback((value: string) => {
    const link = normalizeLink(value);
    setCommitted((prev) => (prev === link ? prev : link));
    if (link !== DEFAULT_URL) setMode('code');
  }, []);

  useEffect(() => {
    const link = normalizeLink(draft);
    const t = window.setTimeout(() => commitDraft(link), REBUILD_DELAY);
    return () => window.clearTimeout(t);
  }, [draft, commitDraft]);

  useEffect(() => {
    ambienceRef.current = new Ambience();
    return () => ambienceRef.current?.dispose();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  // ---- interactions ------------------------------------------------------

  const toggleMode = useCallback(() => {
    setMode((m) => {
      const next: ViewMode = m === 'tree' ? 'code' : 'tree';
      if (next === 'code') ambienceRef.current?.chord();
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    const on = ambienceRef.current?.toggle() ?? false;
    setMuted(!on);
  }, []);

  const toggleRain = useCallback(() => {
    setWeather((w) => (w === 'rain' ? 'clear' : 'rain'));
  }, []);

  const clickFire = useCallback(() => {
    if (fireLocked) {
      setModalMessage(
        'Government has left you. Congratulations, you got fucked up. Fire is now under their control. Wait for rain or accept your fate under tyranny.'
      );
      setModalOpen(true);
      return;
    }
    if (!fireOn) {
      setFireOn(true);
      setFireLocked(true);
    } else {
      setModalMessage(
        'Government has left you. Congratulations, you got fucked up. You can\'t control fire anymore. They took everything, even your flames. Enjoy the burn.'
      );
      setModalOpen(true);
    }
  }, [fireOn, fireLocked]);

  const share = useCallback(async () => {
    // Share must use the text currently in the field, not the debounced value.
    const url = normalizeLink(draft);
    commitDraft(url);
    try {
      // Loaded on demand: the QR encoder is not needed until the visitor shares.
      const { buildShareImage } = await import('./share/qrImage');
      // Capture QR as proper scannable PNG with link text
      const blob = await buildShareImage(url, palette);
      const file = new File([blob], 'qr-tree-code.png', { type: 'image/png' });

      // Try Web Share API with image
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'QR Tree Code',
          text: `Scan this tree: ${url}`,
          files: [file],
        });
        return;
      }

      // Fallback: share URL only
      if (navigator.share) {
        await navigator.share({
          title: 'QR Tree Code',
          text: 'A tree that is also a scannable QR code.',
          url,
        });
        return;
      }

      // Final fallback: copy link to clipboard
      await navigator.clipboard.writeText(url);
      setToast('Link copied');
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') setToast('Could not share');
    }
  }, [draft, palette, commitDraft]);

  const onCanvasKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMode();
    }
  };

  const hint = mode === 'tree' ? 'Tap the tree to see the QR code' : 'Tap to see the tree';

  return (
    <div className="stage" style={{ background: palette.ground }}>
      <InfoPanel open={showInfo} onToggle={() => setShowInfo((v) => !v)} />

      <canvas
        ref={canvasRef}
        className="stage__canvas"
        role="button"
        tabIndex={0}
        aria-label={hint}
        onClick={toggleMode}
        onKeyDown={onCanvasKey}
      />
      {sceneError && (
        <div className="scene-error" role="alert">
          {sceneError}
        </div>
      )}

      <WeatherControls
        mode={mode}
        rainOn={weather === 'rain'}
        fireOn={fireOn}
        fireLocked={fireLocked}
        onToggleRain={toggleRain}
        onFireClick={clickFire}
      />

      <Dock
        dockRef={dockRef}
        draft={draft}
        onDraftChange={setDraft}
        onDraftCommit={commitDraft}
        toast={toast}
        hint={hint}
        onToggleMode={toggleMode}
        onShare={share}
        species={species}
        onSpeciesChange={setSpecies}
        season={season}
        onSeasonChange={setSeason}
        blossom={blossom}
        onBlossomChange={setBlossom}
        muted={muted}
        onToggleSound={toggleSound}
      />

      {modalOpen && <AboutModal message={modalMessage} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
