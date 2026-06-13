<script lang="ts">
    import { Questionnaire } from '../lib/useQuestionnaire.svelte';
    import type { WAISResponseEvent } from '../lib/event';
    import { participant } from '../stores/participant';
    import { onMount } from 'svelte';
    
    // Generic questionnaire imports
    const q = new Questionnaire('wais');
    
    // Local questionnaire logic
    let responseLog: WAISResponseEvent[] = [];
    let answers: Record<'direct' | 'indirect', number[][]> = {
        direct: Array.from({ length: 8 }, () => Array(2).fill(null)),
        indirect: Array.from({ length: 8 }, () => Array(2).fill(null))
    };
    let startTime: number | null = null;

    onMount(() => {
        startQuestionnaire();
    })

    function startQuestionnaire() {
        startTime = Date.now();

        // Log start
        responseLog.push({
            t: startTime,
            order: null,
            item: null,
            essai: null,
            score: null
        });

    }

    function logAnswer(
        order: 'direct' | 'indirect', 
        item: number,
        essai: number,
        score: number,
    ) {
        if (!startTime) return;

        responseLog.push({
            t: Date.now(),
            order: order,
            item: item,
            essai: essai,
            score: score,
        });
    }  

    async function finish() {
        await q.submit(responseLog, $participant.meta.code);
    }


</script>

<div class="bg-white p-6 rounded shadow w-full max-w-2xl">
    <h1 class="text-xl font-semibold mb-4">WAIS-IV</h1>

    <div class="flex items-center">

        <div class="flex flex-col flex-1 items-center">
            <!-- Ordre direct -->
            <h2 class="text-l font-semibold mb-2">Ordre direct</h2>
            {#each { length: 8 }, item}
                <div class="flex items-center pb-4">
                    <span>{item+1}.</span>
                    <div class="flex flex-col pl-4">

                        {#each { length: 2 }, essai}
                            <div class="flex space-x-2 items-center">
                                <span>{essai+1}.</span>

                                <div class="flex space-x-4 items-center">
                                    <label>
                                        <input 
                                            type="radio" 
                                            bind:group={answers.direct[item][essai]}
                                            value={0}
                                            on:change={() => logAnswer('direct', item, essai, 0)}
                                        />
                                        0
                                    </label>
                                    
                                    <label>
                                        <input 
                                            type="radio"
                                            bind:group={answers.direct[item][essai]}
                                            value={1}
                                            on:change={() => logAnswer('direct', item, essai, 1)}
                                        />
                                        1
                                    </label>
                                </div>

                            </div>
                        {/each}

                    </div>
                </div>
            {/each}
        </div>

        <div class="flex flex-col flex-1 items-center">
            <!-- Ordre indirect -->
            <h2 class="text-l font-semibold mb-2">Ordre indirect</h2>
            {#each { length: 8 }, item}
                <div class="flex items-center pb-4">
                    <span>{item+1}.</span>
                    <div class="flex flex-col pl-4">

                        {#each { length: 2 }, essai}
                            <div class="flex space-x-2 items-center">
                                <span>{essai+1}.</span>

                                <div class="flex space-x-4 items-center">
                                    <label>
                                        <input 
                                            type="radio" 
                                            bind:group={answers.indirect[item][essai]}
                                            value={0}
                                            on:change={() => logAnswer('indirect', item, essai, 0)}
                                        />
                                        0
                                    </label>
                                    
                                    <label>
                                        <input 
                                            type="radio"
                                            bind:group={answers.indirect[item][essai]}
                                            value={1}
                                            on:change={() => logAnswer('indirect', item, essai, 1)}
                                        />
                                        1
                                    </label>
                                </div>

                            </div>
                        {/each}

                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Finish Button -->
    <div class="mt-6 text-center">
        <button
            class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            on:click={finish}
        >
            {q.submitting ? 'Envoi...' : 'Valider'}
        </button>
    </div>

    {#if q.error}
        <p class="text-red-600 text-sm mt-2">{q.error}</p>
    {/if}

</div>