import { useState } from "react";

export const useCodeState = () => {
  const [predicatesCode, setPredicatesCode] = useState("");
  const [constantsCode, setConstantsCode] = useState("");
  const [universeCode, setUniverseCode] = useState("");
  const [queryCode, setQueryCode] = useState("");

  return {
    predicatesCode,
    constantsCode,
    universeCode,
    queryCode,
    setPredicatesCode,
    setConstantsCode,
    setUniverseCode,
    setQueryCode,
  };
};
