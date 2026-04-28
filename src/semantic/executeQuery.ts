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
      const domain = Array.from(model.universe.values()).flat();
      const isForAll = expr.quantifier === "ForAll";
      const quantifiedVars = expr.vars.map((v) => v.name);

      const enumerateAssignments = (
        seed: Binding,
      ): Binding[] => {
        let frontier: Binding[] = [clone(seed)];
        for (const name of quantifiedVars) {
          const next: Binding[] = [];
          for (const b of frontier) {
            for (const value of domain) {
              const extended = clone(b);
              extended.set(name, value);
              next.push(extended);
            }
          }
          frontier = next;
        }
        return frontier;
      };

      const stripQuantified = (b: Binding): Binding => {
        const c = clone(b);
        for (const name of quantifiedVars) c.delete(name);
        return c;
      };

      const bindingKey = (b: Binding): string =>
        [...b.entries()]
          .sort(([a], [b2]) => a.localeCompare(b2))
          .map(([k, v]) => `${k}=${v}`)
          .join("|");

      const out: Binding[] = [];

      for (const seed of seeds) {
        const assignments = enumerateAssignments(seed);

        if (isForAll) {
          // Gather candidate free-var bindings from any satisfying assignment;
          // a candidate survives only if the body holds for *every* assignment.
          const candidates = new Map<string, Binding>();
          if (assignments.length === 0) {
            candidates.set(bindingKey(seed), clone(seed));
          } else {
            for (const a of assignments) {
              for (const sol of solve(expr.body, model, [a])) {
                const stripped = stripQuantified(sol);
                candidates.set(bindingKey(stripped), stripped);
              }
            }
            if (candidates.size === 0) {
              // body unsatisfiable somewhere — but if it has no free vars and
              // domain is empty, ∀ is vacuously true. Seed is the only candidate.
              candidates.set(bindingKey(seed), clone(seed));
            }
          }

          for (const cand of candidates.values()) {
            let allHold = true;
            for (const a of assignments) {
              const merged = clone(cand);
              for (const [k, v] of a) {
                if (quantifiedVars.includes(k)) merged.set(k, v);
              }
              if (solve(expr.body, model, [merged]).length === 0) {
                allHold = false;
                break;
              }
            }
            if (allHold) out.push(cand);
          }
        } else {
          // Exists: collect all body solutions across assignments, strip
          // quantified vars, dedupe.
          const seen = new Map<string, Binding>();
          for (const a of assignments) {
            for (const sol of solve(expr.body, model, [a])) {
              const stripped = stripQuantified(sol);
              const key = bindingKey(stripped);
              if (!seen.has(key)) seen.set(key, stripped);
            }
          }
          out.push(...seen.values());
        }
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
