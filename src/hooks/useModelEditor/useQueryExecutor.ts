import { useCallback, useState } from "react";
import type { Model, QueryResult } from "../../types";
import { executeQuery } from "../../semantic/executeQuery";

export const useQueryExecutor = (
  model: Model | null,
  queryCode: string,
  errors: string[],
) => {
  const [queryResult, setQueryResult] = useState<QueryResult["value"]>(null);

  const execute = useCallback(() => {
    if (!model || errors.length) return;
    const result = executeQuery(queryCode, model);
    setQueryResult(result.value);
  }, [model, queryCode, errors]);

  return { queryResult, execute };
};
