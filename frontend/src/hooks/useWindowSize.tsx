import { useLayoutEffect, useState } from "react";
import { SCREEN } from "../constants";

const useWindowSize = () => {
  const [size, setSize] = useState<string>("dekstop");
  const [width, setWidth] = useState<number>(window.innerWidth);
  useLayoutEffect(() => {
    function updateSize() {
      setSize(
        window.innerWidth < parseInt(SCREEN.TABLET.replace("px", ""))
          ? "phone"
          : "desktop"
      );
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return { size, width };
};

export default useWindowSize;
