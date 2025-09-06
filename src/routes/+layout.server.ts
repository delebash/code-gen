import { remult } from "remult";
import type { LayoutServerLoad } from "../../.svelte-kit/types/src/routes";

export const load = (async () => {
  return { user: remult.user };
}) satisfies LayoutServerLoad;
