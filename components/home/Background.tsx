/** Fixed grid + floating colour blobs behind everything else. */
const Background = () => {
  return (
    <>
      <div className="bg-layer bg-grid" aria-hidden />
      <div className="bg-layer" aria-hidden>
        <div className="bg-blob blob-1" />
        <div className="bg-blob blob-2" />
        <div className="bg-blob blob-3" />
      </div>
    </>
  );
};

export default Background;
