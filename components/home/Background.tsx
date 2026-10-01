/**
 * The page's backdrop, back to front: drifting pools of colour, the top light,
 * and a static film grain.
 */
const Background = () => {
  return (
    <>
      <div className="bg-layer bg-aurora" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="bg-layer bg-light" aria-hidden />
      <div className="bg-layer bg-grain" aria-hidden />
    </>
  );
};

export default Background;
