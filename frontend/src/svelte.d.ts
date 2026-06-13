// Solves unknown import in router.ts
declare module '*.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class Component extends SvelteComponentTyped<
    any,
    any,
    any
  > {}
}

// Same for .svelte.ts files
declare module '*.svelte.ts';