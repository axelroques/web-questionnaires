<script lang="ts">
    import { Questionnaire } from '../lib/useQuestionnaire.svelte';
    import type { SAMResponseEvent } from '../lib/event';
    import { participant } from '../stores/participant';
    import { onMount } from 'svelte';
    
    // Generic questionnaire imports
    const q = new Questionnaire('sam');
    
    // Local questionnaire logic
    let responseLog: SAMResponseEvent[] = [];
    let selected: (number | null)[] = Array(2).fill(null);
    let startTime: number | null = null;

    onMount(() => {
        startQuestionnaire();
    })

    function startQuestionnaire() {
        startTime = Date.now();
        responseLog.push({ t: startTime, line: null, imagePos: null, });
    }

    function logAnswer(line: number, imagePos: number) {
        if (!startTime) return;
        responseLog.push({ t: Date.now(), line, imagePos });
    }  

    function selectImage(line: number, imagePos: number) {
        selected[line] = imagePos;
        logAnswer(line, imagePos);
    }

    async function finish() {
        await q.submit(responseLog, $participant.meta.code);
    }
    
</script>

<div class="bg-white p-6 rounded shadow w-full max-w-2xl">
    <h1 class="text-xl font-semibold mb-4">SAM</h1>

    <div class="flex flex-col items-center space-y-4">
        {#each { length: 2 }, line}
            <div class="flex justify-evenly items-center space-x-2">
                {#each { length: 9 }, imagePos}
                    <button 
                        class="cursor-pointer border-2 rounded {selected[line] === imagePos 
                               ? 'border-blue-500 scale-110' 
                               : 'border-transparent'}"
                        on:click={() => selectImage(line, imagePos)}
                    >
                        <img 
                            alt="sam-line-{line+1}-pos-{imagePos+1}" 
                            src="sam/sam_{line+1}_{imagePos+1}.png" 
                        />
                    </button>
                {/each}
            </div>
        {/each}
    </div> 

    <!-- Finish Button -->
    <div class="mt-6 text-center">
        <button
            class="px-4 py-2 bg-blue-600 text-white rounded"
            on:click={finish}
        >
            {q.submitting ? 'Envoi...' : 'Valider'}
        </button>
    </div>

    {#if q.error}
        <p class="text-red-600 text-sm mt-2">{q.error}</p>
    {/if}

</div>