import { useEffect, useRef, useState, type FocusEventHandler } from 'react';

export function useFocusVisible<Element extends HTMLElement>() {
  const keyboardModality = useRef(false);
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => {
    const markKeyboardModality = () => {
      keyboardModality.current = true;
    };
    const clearKeyboardModality = () => {
      keyboardModality.current = false;
    };

    document.addEventListener('keydown', markKeyboardModality, true);
    document.addEventListener('pointerdown', clearKeyboardModality, true);
    return () => {
      document.removeEventListener('keydown', markKeyboardModality, true);
      document.removeEventListener('pointerdown', clearKeyboardModality, true);
    };
  }, []);

  const onFocus: FocusEventHandler<Element> = () => {
    setFocusVisible(keyboardModality.current);
  };
  const onBlur: FocusEventHandler<Element> = () => {
    setFocusVisible(false);
  };

  return { focusVisible, onFocus, onBlur };
}
