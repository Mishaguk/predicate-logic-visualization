import { parseConstants } from "../dsl/constants/constants.parse";
import { parsePredicates } from "../dsl/predicates/predicates.parse";
import { parseUniverse } from "../dsl/universe/universe.parse";
import type { Model, ParseError } from "../types";

type SyntaxErrors = {
  universe: ParseError[];
  constants: ParseError[];
  predicates: ParseError[];
};

export function buildModel(
  universeCode: string,
  constantsCode: string,
  predicatesCode: string,
): { model: Model | null; syntaxErrors: SyntaxErrors } {
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
    return { model: null, syntaxErrors };
  }

  return {
    model: {
      universe: universeResult.value,
      constants: constantsResult.value,
      predicates: predicatesResult.value,
    },
    syntaxErrors,
  };
}

export function validateModel(model: Model): string[] {
  const errors = [];
  for (const [name, value] of model.constants) {
    if (!model.universe?.has(value)) {
      errors.push(`Constant "${name}" points to unknown element "${value}"`);
    }
  }

  model.predicates.forEach((predicate) => {
    predicate.args.forEach((arg, i) => {
      if (!model.constants?.has(arg)) {
        errors.push(
          `Argument ${i + 1} '${arg}' in predicate ${predicate.name} is not defined`,
        );
      }
    });
  });
  return errors;
}
