export type ProjectFile = {
  formatVersion: 1;
  universe: string;
  constants: string;
  predicates: string;
  query: string;
};

export type ProjectBuffers = Omit<ProjectFile, "formatVersion">;

export type ParseProjectResult =
  | { ok: true; project: ProjectFile }
  | { ok: false; error: string };

export const serializeProject = (buffers: ProjectBuffers): string => {
  const project: ProjectFile = { formatVersion: 1, ...buffers };
  return JSON.stringify(project, null, 2);
};

export const parseProject = (text: string): ParseProjectResult => {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "Invalid JSON file." };
  }

  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Project file must be a JSON object." };
  }

  const obj = raw as Record<string, unknown>;
  const stringField = (key: string): string | null => {
    const v = obj[key];
    if (v === undefined) return "";
    return typeof v === "string" ? v : null;
  };

  const universe = stringField("universe");
  const constants = stringField("constants");
  const predicates = stringField("predicates");
  const query = stringField("query");

  if (universe === null || constants === null || predicates === null || query === null) {
    return {
      ok: false,
      error: "Project fields universe/constants/predicates/query must be strings.",
    };
  }

  return {
    ok: true,
    project: {
      formatVersion: 1,
      universe,
      constants,
      predicates,
      query,
    },
  };
};

export const downloadProjectFile = (filename: string, json: string): void => {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
