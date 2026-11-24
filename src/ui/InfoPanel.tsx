import { BrandMark, InfoIcon } from './icons';

interface InfoPanelProps {
  open: boolean;
  onToggle: () => void;
}

export function InfoPanel({ open, onToggle }: InfoPanelProps) {
  return (
    <>
      <a className="brand" href="/" aria-label="QR Tree Code home">
        <BrandMark />
        <span className="brand__text">
          <span className="brand__name">QR Tree Code</span>
          <span className="brand__tag">3D QR</span>
        </span>
      </a>

      <div className="info">
        <button
          className="info__btn"
          type="button"
          aria-expanded={open}
          aria-label="About this project"
          onClick={onToggle}
        >
          <InfoIcon />
        </button>
        {open && (
          <div className="info__card" role="dialog" aria-label="About QR Tree Code">
            <p>
              Based on{' '}
              <a href="https://github.com/Slifronic/magic-tree" target="_blank" rel="noopener noreferrer">
                Magic Tree
              </a>
              {' '}by Slifronic — MIT licensed. An isometric QR-tree built with React and three.js.
            </p>
            <p>
              Earlier fork: magic-tree-qr (deleted)
              {' · '}
              <a href="https://github.com/budife/qr-tree-code" target="_blank" rel="noopener noreferrer">
                this repo
              </a>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
