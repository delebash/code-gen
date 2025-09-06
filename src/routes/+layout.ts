import { remult } from "remult";
import type { LayoutLoad } from "../../.svelte-kit/types/src/routes";

export const load = (async (event) => {
  remult.useFetch(event.fetch);
  return { user: event.data.user };
}) satisfies LayoutLoad;
