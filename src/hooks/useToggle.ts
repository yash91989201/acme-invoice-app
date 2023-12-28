import { useState } from "react";

export default function useToggle(initialValue: boolean) {
  const [state, setState] = useState(initialValue);

  const on = () => setState(true);
  const off = () => setState(false);
  const toggle = () => setState(!state);
  return {
    isOn: state == true,
    isOpen: state == true,
    on,
    off,
    open: on,
    close: off,
    toggle,
  };
}
