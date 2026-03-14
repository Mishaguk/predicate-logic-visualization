import { parseQuery } from "../dsl/query/query.parse";
import type {
  Atom,
  Binding,
  Model,
  Predicate,
  QueryExpression,
  QueryResult,
} from "../types";

const clone = (b: Binding) => new Map(b);

function hasVariables(
  expr: QueryExpression,
  bound: Set<string> = new Set(),
): boolean {
  switch (expr.kind) {
    case "Atom":
      return expr.args.some((t) => t.kind === "Var" && !bound.has(t.name));
    case "Quantifier": {
      const nextBound = new Set(bound);
      for (const v of expr.vars) {
        nextBound.add(v.name);
      }
      return hasVariables(expr.body, nextBound);
    }
    case "Not":
      return hasVariables(expr.operand, bound);
    case "And":
    case "Or":
      return hasVariables(expr.left, bound) || hasVariables(expr.right, bound);
    case "Implies":
      return hasVariables(expr.left, bound) || hasVariables(expr.right, bound);
    case "Iff":
      return hasVariables(expr.left, bound) || hasVariables(expr.right, bound);
  }
}

function unifyAtomWithFact(
  atom: Atom,
  fact: Predicate,
  seed: Binding,
  model: Model,
): Binding | null {
  if (atom.name !== fact.name || atom.args.length !== fact.args.length)
    return null;

  const out = clone(seed);

  for (let i = 0; i < atom.args.length; i++) {
    const term = atom.args[i];

    if (term.kind === "Const") {
      const constUniverseValue = model.constants.get(term.name);
      if (!constUniverseValue) return null;
      if (constUniverseValue !== fact.universeArgs[i]) return null;
      continue;
    }

    const varName = term.name;
    const candidate = fact.universeArgs[i];
    const existing = out.get(varName);

    if (existing && existing !== candidate) return null;
    out.set(varName, candidate);
  }

  return out;
}

function solve(
  expr: QueryExpression,
  model: Model,
  seeds: Binding[],
): Binding[] {
  switch (expr.kind) {
    case "Atom": {
      const facts = model.predicates.filter(
        (p) => p.name === expr.name && p.args.length === expr.args.length,
      );

      const out: Binding[] = [];
      for (const seed of seeds) {
        for (const fact of facts) {
          const merged = unifyAtomWithFact(expr, fact, seed, model);
          if (merged) out.push(merged);
        }
      }

      return out;
    }
    case "And": {
      const left = solve(expr.left, model, seeds);
      return solve(expr.right, model, left);
    }
    case "Or": {
      return [
        ...solve(expr.left, model, seeds),
        ...solve(expr.right, model, seeds),
      ];
    }
    case "Implies": {
      const out: Binding[] = [];

      for (const seed of seeds) {
        const leftSolutions = solve(expr.left, model, [clone(seed)]);

        // A false -> (A -> B) true
        if (leftSolutions.length === 0) {
          out.push(seed);
          continue;
        }

        // A true under some bindings -> require B under those bindings
        const rightSolutions = solve(expr.right, model, leftSolutions);
        out.push(...rightSolutions);
      }

      return out;
    }
    case "Iff": {
      return solve(
        {
          kind: "And",
          left: {
            kind: "Implies",
            left: expr.left,
            right: expr.right,
          },
          right: {
            kind: "Implies",
            left: expr.right,
            right: expr.left,
          },
        },
        model,
        seeds,
      );
    }
    case "Not": {
      return seeds.filter(
        (seed) => solve(expr.operand, model, [clone(seed)]).length === 0,
      );
    }
    case "Quantifier": {
      // Variables are unified against predicate.universeArgs, so quantified
      // assignments must iterate over universe values as well.
      const domain = Array.from(model.universe.values()).flat(); // Set<string> -> string[]
      const isForAll = expr.quantifier === "ForAll";
      const out: Binding[] = [];

      for (const seed of seeds) {
        const checkAssignment = (idx: number, current: Binding): boolean => {
          if (idx === expr.vars.length) {
            return solve(expr.body, model, [current]).length > 0;
          }

          const varName = expr.vars[idx].name;

          if (domain.length === 0) {
            return isForAll;
          }

          for (const value of domain) {
            const next = clone(current);
            next.set(varName, value);
            const branch = checkAssignment(idx + 1, next);

            if (isForAll && !branch) return false;
            if (!isForAll && branch) return true;
          }

          return isForAll ? true : false;
        };

        const ok = checkAssignment(0, clone(seed));
        if (ok) out.push(clone(seed));
      }

      return out;
    }
  }
}

export function executeQuery(queryCode: string, model: Model): QueryResult {
  const parsed = parseQuery(queryCode);

  if (!parsed.value || parsed.errors.length) {
    return {
      value: null,
      errors: parsed.errors,
    };
  }

  const solutions = solve(parsed.value, model, [new Map()]);
  const withVars = hasVariables(parsed.value);

  return {
    value: withVars ? solutions : solutions.length > 0,
    errors: parsed.errors,
  };
}
