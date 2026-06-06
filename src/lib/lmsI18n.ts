export function pickTranslated<T extends Record<string, any>>(
  base: T,
  translation: Partial<T> | null | undefined,
  fields: (keyof T)[],
): T {
  if (!translation) return base;
  const out = { ...base } as T;
  for (const f of fields) {
    const val = translation[f];
    if (val !== undefined && val !== null) {
      if (typeof val === "string") {
        if (val.trim() === "") continue;
      }
      (out as any)[f] = val;
    }
  }
  return out;
}
