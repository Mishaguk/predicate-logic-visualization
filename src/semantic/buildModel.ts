import { parseConstants } from "../dsl/constants/constants.parse";
import { parsePredicates } from "../dsl/predicates/predicates.parse";
import { parseUniverse } from "../dsl/universe/universe.parse";
import type { Model, SyntaxError } from "../types";

type SyntaxErrors = {
  universe: SyntaxError[];
  constants: SyntaxError[];
  predicates: SyntaxError[];
};

function fillPredicatesUniverseArgs(model: Model): Model {
  const predicates = model.predicates.map((predicate) => {
    const universeArgs = predicate.args.map(
      (arg) => model.constants.get(arg) ?? "__UNRESOLVED_CONSTANT__",
    );

    return { ...predicate, universeArgs };
  });

  return { ...model, predicates };
}

export type BuildModelResult = {
  model: Model | null;
  syntaxErrors: SyntaxErrors;
  semanticErrors: string[];
};

export function buildModel(
  universeCode: string,
  constantsCode: string,
  predicatesCode: string,
): BuildModelResult {
  const universeResult = parseUniverse(universeCode);
  const constantsResult = parseConstants(constantsCode);
  const predicatesResult = parsePredicates(predicatesCode);

  const syntaxErrors: SyntaxErrors = {
    universe: universeResult.errors,
    constants: constantsResult.errors,
    predicates: predicatesResult.errors,
  };

  const hasSyntaxErrors =
    syntaxErrors.universe.length ||
    syntaxErrors.constants.length ||
    syntaxErrors.predicates.length;

  if (
    hasSyntaxErrors ||
    !universeResult.value ||
    !constantsResult.value ||
    !predicatesResult.value
  ) {
    return { model: null, syntaxErrors, semanticErrors: [] };
  }

  const baseModel: Model = {
    universe: universeResult.value,
    constants: constantsResult.value,
    predicates: predicatesResult.value,
  };
  const model = fillPredicatesUniverseArgs(baseModel);
  const semanticErrors = validateModel(model);

  return {
    model,
    syntaxErrors,
    semanticErrors,
  };
}

export function validateModel(model: Model): string[] {
  const errors: string[] = [];

  const domain = [...model.universe.values()].flat();

  for (const [name, value] of model.constants) {
    if (!domain.includes(value)) {
      errors.push(`Constant "${name}" points to unknown element "${value}"`);
    }
  }

  const arityByName = new Map<string, number>();
  model.predicates.forEach((predicate) => {
    const currentArity = predicate.args.length;
    const knownArity = arityByName.get(predicate.name);

    if (knownArity === undefined) {
      arityByName.set(predicate.name, currentArity);
      return;
    }

    if (knownArity !== currentArity) {
      errors.push(
        `Predicate "${predicate.name}" has conflicting arity: expected ${knownArity}, got ${currentArity}.`,
      );
    }
  });

  model.predicates.forEach((predicate) => {
    predicate.args?.forEach((arg, i) => {
      if (!model.constants?.has(arg)) {
        errors.push(
          `Argument ${i + 1} '${arg}' in predicate ${predicate.name} is not defined`,
        );
      }
    });
  });
  return errors;
}
