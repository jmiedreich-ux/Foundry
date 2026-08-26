import * as React from 'react';

const CSS_CLASS = 'reduce-motion';

export function MotionSetting() {
  const wasReduced = React.useRef(document.body.classList.contains(CSS_CLASS));
  const [reduced, setReduced] = React.useState(wasReduced.current);

  React.useEffect(() => {
    document.body.classList.toggle(CSS_CLASS, reduced);
    return () => {
      document.body.classList.toggle(CSS_CLASS, wasReduced.current);
    };
  }, [reduced]);

  return (
    <button
      type="button"
      aria-pressed={reduced}
      onClick={() => setReduced((prev) => !prev)}
    >
      {reduced ? 'Motion reduced' : 'Reduce motion'}
    </button>
  );
}
