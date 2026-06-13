<script lang="ts">
  export let letter: string = 'd';
  export let upper: number = 0;
  export let below: number = 0;
  export let clicked: boolean = false;
  export let onClick: () => void = () => {};
  export let correction: 'green' | 'orange' | 'red' | null = null;
</script>

<button
    on:click={onClick}
    disabled={correction !== null}
    class="
        flex flex-col items-center justify-center transition
        {clicked && !correction ? 'bg-gray-300' : ''}
        {correction === 'green' ? 'bg-green-400' : ''}
        {correction === 'orange' ? 'bg-orange-400' : ''}
        {correction === 'red' ? 'bg-red-400' : ''}
    "
>

    {#if upper === 1}
        <div class="flex justify-center items-center">
            <span class="font-bold text-[11px]">&vert;</span>
        </div>
    {:else if upper === 2}
        <div class="flex justify-center items-center">
            <span class="font-bold text-[11px]">&vert;</span>
            <span class="font-bold text-[11px]">&vert;</span>
        </div>
    {:else}
        <div class="flex justify-center items-center">
            <span class="text-[11px]">⠀</span>
        </div>
    {/if}
        
    <span>{letter}</span>

    {#if below === 1}
        <div class="flex justify-center items-center">
            <span class="font-bold text-[11px]">&vert;</span>
        </div>
    {:else if below === 2}
        <div class="flex justify-center items-center">
            <span class="font-bold text-[11px]">&vert;</span>
            <span class="font-bold text-[11px]">&vert;</span>
        </div>
    {:else}
        <div class="flex justify-center items-center">
            <span class="text-[11px]">⠀</span>
        </div>
    {/if}
</button>
