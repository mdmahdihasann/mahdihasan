/**
 * The page's backdrop, back to front: drifting pools of colour, the top light,
 * and a static film grain.
 */
const Background = () => {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 aurora" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(95,140,104,.14),transparent_70%),linear-gradient(180deg,transparent_45%,rgba(20,31,24,.85))]" aria-hidden />
      <div className="pointer-events-none fixed inset-0 z-0 grain" aria-hidden />
    </>
  );
};

export default Background;
