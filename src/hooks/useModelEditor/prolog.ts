import type { Model, QueryExpression, QueryTerm } from "../../types";

type SerializeOptions = {
  model: Model;
  queryAst?: QueryExpression | null;
};

const isSimplePrologAtom = (value: string) =>
  /^[a-z][a-zA-Z0-9_]*$/.test(value);

const escapeQuotedAtom = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

const toPrologAtom = (value: string) => {
  const normalized = value.toLowerCase();
  return isSimplePrologAtom(normalized)
    ? normalized
    : `'${escapeQuotedAtom(value)}'`;
};

const sanitizeVarBase = (value: string): string => {
  const stripped = value.replace(/^\?/, "");
  const sanitized = stripped.replace(/[^a-zA-Z0-9_]/g, "_");
  if (!sanitized) return "V";
  return sanitized;
};

const toPrologVar = (value: string): string => {
  const base = sanitizeVarBase(value);
  const normalized = base.startsWith("_") ? `V${base}` : base;
  return `${normalized[0].toUpperCase()}${normalized.slice(1)}`;
};

const getVarName = (raw: string, varMap: Map<string, string>): string => {
  const known = varMap.get(raw);
  if (known) return known;

  let candidate = toPrologVar(raw);
  const taken = new Set(varMap.values());
  let suffix = 2;

  while (taken.has(candidate)) {
    candidate = `${toPrologVar(raw)}_${suffix}`;
    suffix += 1;
  }

  varMap.set(raw, candidate);
  return candidate;
};

const termToProlog = (term: QueryTerm, varMap: Map<string, string>): string => {
  if (term.kind === "Var") {
    return getVarName(term.name, varMap);
  }

  return toPrologAtom(term.name);
};

const expressionToProlog = (
  expr: QueryExpression,
  model: Model,
  varMap: Map<string, string>,
): string => {
  switch (expr.kind) {
    case "Atom": {
      const args = expr.args.map((arg) => termToProlog(arg, varMap));
      return `${toPrologAtom(expr.name)}(${args.join(", ")})`;
    }
    case "And":
      return `(${expressionToProlog(expr.left, model, varMap)}, ${expressionToProlog(expr.right, model, varMap)})`;
    case "Or":
      return `(${expressionToProlog(expr.left, model, varMap)}; ${expressionToProlog(expr.right, model, varMap)})`;
    case "Not":
      return `\\+ (${expressionToProlog(expr.operand, model, varMap)})`;
    case "Implies": {
      const left = expressionToProlog(expr.left, model, varMap);
      const right = expressionToProlog(expr.right, model, varMap);
      return `(\\+ (${left}); (${right}))`;
    }
    case "Iff": {
      const left = expressionToProlog(expr.left, model, varMap);
      const right = expressionToProlog(expr.right, model, varMap);
      return `((\\+ (${left}); (${right})), (\\+ (${right}); (${left})))`;
    }
    case "Quantifier": {
      const scopedMap = new Map(varMap);
      const vars = expr.vars.map((variable) =>
        getVarName(variable.name, scopedMap),
      );
      const body = expressionToProlog(expr.body, model, scopedMap);

      if (expr.quantifier === "Exists") {
        return body;
      }

      if (vars.length === 1) {
        return `forall(domain(${vars[0]}), (${body}))`;
      }

      const generator = vars.map((v) => `domain(${v})`).join(", ");
      return `forall((${generator}), (${body}))`;
    }
  }
};

const collectFreeVariables = (
  expr: QueryExpression,
  bound: Set<string> = new Set(),
  out: string[] = [],
): string[] => {
  switch (expr.kind) {
    case "Atom":
      expr.args.forEach((arg) => {
        if (
          arg.kind !== "Var" ||
          bound.has(arg.name) ||
          out.includes(arg.name)
        ) {
          return;
        }
        out.push(arg.name);
      });
      return out;
    case "Not":
      return collectFreeVariables(expr.operand, bound, out);
    case "And":
    case "Or":
    case "Implies":
    case "Iff":
      collectFreeVariables(expr.left, bound, out);
      collectFreeVariables(expr.right, bound, out);
      return out;
    case "Quantifier": {
      const nextBound = new Set(bound);
      expr.vars.forEach((variable) => nextBound.add(variable.name));
      return collectFreeVariables(expr.body, nextBound, out);
    }
  }
};

export const serializeModelToProlog = ({
  model,
  queryAst,
}: SerializeOptions): string => {
  const lines: string[] = [];

  lines.push("% Auto-generated PROLOG export");
  lines.push("% Domain interpretation");
  const domainValues = [...new Set([...model.universe.values()].flat())];
  for (const value of domainValues) {
    lines.push(`domain(${toPrologAtom(value)}).`);
  }

  lines.push("");
  lines.push("% Facts");
  model.predicates.forEach((predicate) => {
    lines.push(
      `${toPrologAtom(predicate.name)}(${predicate.args.map(toPrologAtom).join(", ")}).`,
    );
  });

  if (queryAst) {
    const varMap = new Map<string, string>();
    const goal = expressionToProlog(queryAst, model, varMap);
    const freeVars = collectFreeVariables(queryAst);

    lines.push("");
    lines.push("% Query");
    if (freeVars.length === 0) {
      lines.push(`query :- ${goal}.`);
      lines.push("% Run: ?- query.");
    } else {
      const args = freeVars.map((v) => getVarName(v, varMap)).join(", ");

      lines.push(`query(${args}) :- ${goal}.`);
      lines.push(`% Run: ?- query(${args}).`);
    }
  }

  return lines.join("\n");
};
