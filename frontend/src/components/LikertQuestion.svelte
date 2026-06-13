<script lang="ts">
  export let id: number;
  export let text: string;
  export let value: number | null = null;
  export let min = 1;
  export let max = 5;
  export let onAnswer: (questionId: number, value: number) => void;
</script>

<li class="flex items-center">
  <span class="flex-1 text-sm">{text}</span>

  <div class="flex gap-2">
    {#each Array(max - min + 1).fill(0).map((_, i) => i + min) as v}
      <label class="flex flex-col items-center text-xs">
        <input
          type="radio"
          name={`${id}`}
          value={v}
          bind:group={value}
          on:change={() => onAnswer(id, v)}
        />
        {v}
      </label>
    {/each}
  </div>
</li>
<div class="border-1 border-gray-100 mb-1"></div>
