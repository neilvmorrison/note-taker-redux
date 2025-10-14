import { useState } from "react";

export default function useToggle(initalValue: boolean): [boolean, () => void] {
  const [value, setValue] = useState(initalValue);

  function toggle() {
    setValue((prevVal) => !prevVal);
  }

  return [value, toggle];
}
