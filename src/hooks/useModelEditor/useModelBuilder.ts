import { useMemo } from "react";
import { buildModel } from "../../semantic/buildModel";

export const useModelBuilder = (
  universeCode: string,
  constantsCode: string,
  predicatesCode: string,
) => {
  return useMemo(() => {
    return buildModel(universeCode, constantsCode, predicatesCode);
  }, [universeCode, constantsCode, predicatesCode]);
};
