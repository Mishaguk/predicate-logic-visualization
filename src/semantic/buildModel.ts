import { parseConstants } from "../dsl/constants/constants.parse";
import { parsePredicates } from "../dsl/predicates/predicates.parse";
import { parseUniverse } from "../dsl/universe/universe.parse";
import { type Model } from "../types";

export function buildModel(
  universeCode: string,
  constantsCode: string,
  predicatesCode: string,
): Model {
  return {
    universe: parseUniverse(universeCode),
    constants: parseConstants(constantsCode),
    predicates: parsePredicates(predicatesCode),
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
