import { useContext } from "react";
import  DarkModeContext  from "./DarkModeContext";

export const useDarkMode = () => {
  return useContext(DarkModeContext);
}
