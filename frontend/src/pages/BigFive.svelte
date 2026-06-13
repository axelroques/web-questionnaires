<script lang="ts">
    import LikertQuestion from '../components/LikertQuestion.svelte';
    import { Questionnaire } from '../lib/useQuestionnaire.svelte';
    import type { BigFiveResponseEvent } from '../lib/event';
    import { participant } from '../stores/participant';
    import { questions } from '../assets/bigfive';

    // Generic questionnaire imports
    const q = new Questionnaire('bigFive');
    
    // Local questionnaire logic
    let responseLog: BigFiveResponseEvent[] = [];
    let answers: Record<string, number | null> = {};
    let started = false;
    let startTime: number | null = null;

    $: allAnswered = questions.every((_, i) => answers[`q${i}`] != null);
    
    function startQuestionnaire() {
        startTime = Date.now();
        started = true;

        // Log start
        responseLog.push({ t: startTime, q: null, v: null });
    }

    function logAnswer(questionId: number, value: number) {
        if (!startTime) return;

        responseLog.push({
            t: Date.now(),
            q: questionId,
            v: value
        });
    }  

    async function finish() {
        await q.submit(responseLog, $participant.meta.code);
    }
    
</script>


<div class="bg-white p-6 rounded shadow w-full max-w-2xl">
    <h1 class="text-xl font-semibold mb-4">Big Five Inventory français (BFI-fr)</h1>

    <!-- Instructions -->
    <div class="mb-6 text-gray-600 italic">
        <p class="font-bold">Instructions :</p>
        <div class="text-sm">
            <p>Vous allez trouver un certain nombre de qualificatifs qui peuvent ou non s'appliquer à vous.</p>
            <p>Par exemple, acceptez-vous d'être quelqu'un qui aime passer du temps avec les autres ?</p>
            <p>Ecrivez devant chaque affirmation le chiffre indiquand combien vous approuvez ou désapprouvez l'affirmation :</p>
            <div class="flex flex-col pl-5">
                <p>1 : Désapprouve fortement</p>
                <p>2 : Désapprouve un peu</p>
                <p>3 : N'approuve ni ne désapprouve</p>
                <p>4 : Approuve un peu</p>
                <p>5 : Approuve fortement</p>
            </div>
        </div>
    </div>

    <!-- Start button -->
    {#if !started}
        <button
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            on:click={startQuestionnaire}
        >
            Commencer
        </button>
    {/if}
    
    <!-- Questionnaire -->
    {#if started}
        <div class="mb-6">
            <h1 class="text-l font-semibold">Questionnaire :</h1>
            <p>Je me vois comme quelqu'un qui ...</p>
            <ol class="list-decimal">
                {#each questions as text, index}
                    <LikertQuestion
                        id={index}
                        text={`${index}. ${text}`}
                        bind:value={answers[`q${index}`]}
                        onAnswer={logAnswer}
                    />
                {/each}
            </ol>
        </div>

        <button 
            class="bg-blue-600 text-white px-4 py-2 rounded" 
            disabled={!allAnswered}
            on:click={finish}>
            {q.submitting ? 'Envoi...' : 'Valider'}
        </button>
    {/if}

    {#if q.error}
        <p class="text-red-600 text-sm mt-2">{q.error}</p>
    {/if}
    
</div>