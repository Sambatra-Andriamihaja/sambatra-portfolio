/**
 * Desktop wallpaper. One fixed layer painted with the OS wallpaper gradient
 * (Jammy aubergine on Ubuntu, the Windows 11 bloom on Windows). Static
 * gradients only — no blur filters, no grain, nothing to recomposite.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "var(--wallpaper)" }}
    />
  );
}
