<script lang="ts">
    import { Questionnaire } from '../lib/useQuestionnaire.svelte';
    import type { ISAResponseEvent } from '../lib/event';
    import { participant } from '../stores/participant';
    import { onMount } from 'svelte';

    // Generic questionnaire imports
    const q = new Questionnaire('isa');

    // Local questionnaire logic
    let responseLog: ISAResponseEvent[] = [];
    let answers: (number | null)[] = [];
    let startTime: number | null = null;

    onMount(() => {
        startQuestionnaire();
    })

    function startQuestionnaire() {
        startTime = Date.now();

        // Log start
        responseLog.push({ t: startTime, idEval: null, score: null });
    }

    function logAnswer(idEval: number, score: number) {
        if (!startTime) return;

        responseLog.push({
            t: Date.now(), idEval: idEval, score: score,
        });
    }  

    function addInput() {
        answers = [...answers, null];
    }

    function removeInput(index: number) {
        answers = answers.filter((_, i) => i !== index);
    }

    function updateValue(index: number, value: string) {
        const numeric = Number(value);

        if (numeric >= 1 && numeric <= 5) {
            answers[index] = numeric;
            answers = [...answers];
            logAnswer(index, numeric);
        }
    }

    async function finish() {
        await q.submit(responseLog, $participant.meta.code);
    }
 
</script>

<div class="bg-white p-6 rounded shadow w-full max-w-2xl">
    <h1 class="text-xl font-semibold mb-4">ISA</h1>

    <div class="flex flex-col space-y-4">

        {#each answers as value, index}
            <div class="flex items-center space-x-4">

                <input
                    type="number"
                    min="1"
                    max="5"
                    class="border rounded px-2 py-1 w-20"
                    bind:value={answers[index]}
                    on:change={(e) => 
                        updateValue(index, (e.currentTarget as HTMLInputElement).value)
                    }
                />

                <button
                    class="text-red-600"
                    on:click={() => removeInput(index)}
                >
                    Remove
                </button>

            </div>
        {/each}

        <button
            class="px-3 py-1 bg-gray-200 rounded"
            on:click={addInput}
        >
            + Add Input
        </button>

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