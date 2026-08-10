import { FormValues } from "../../hooks/useSettings";
import type { Options } from "./payloads";

export type BuildCommandBytesFn = (
  formValues: FormValues,
  options: Options,
) => (number[] | Uint8Array | undefined)[];
