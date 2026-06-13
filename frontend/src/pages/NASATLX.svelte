<script lang="ts">
    import { Questionnaire } from '../lib/useQuestionnaire.svelte';
    import type { NASATLXResponseEvent } from '../lib/event';
    import { participant } from '../stores/participant';
    import { onMount } from 'svelte';
    
    // Generic questionnaire imports
    const q = new Questionnaire('nasatlx');
    
    // Local questionnaire logic
    let responseLog: NASATLXResponseEvent[] = [];
    let answers: Record<string, number> = {};
    let startTime: number | null = null;

    onMount(() => {
        startQuestionnaire();
    })

    function startQuestionnaire() {
        startTime = Date.now();

        // Log start
        responseLog.push({ t: startTime, subscale: null, score: null, });
    }

    function logAnswer(subscale: string, score: number) {
        if (!startTime) return;
        responseLog.push({ t: Date.now(), subscale, score });
    }

    async function finish() {
        await q.submit(responseLog, $participant.meta.code);
    }
    
</script>

<div class="bg-white p-6 rounded shadow w-full max-w-6xl">
    <h1 class="text-xl font-semibold mb-4">NASA-TLX</h1>

    <div class="flex flex-col space-y-6">

        <!-- Exigence mentale -->
        <div class="flex flex-col items-center space-y-4">
            <h2 class="text-l font-semibold mb-2">Exigence mentale</h2>
            <div class="flex flex-col">
                <span>Quelle a été l'importance de l'activité mentale et intellectuelle requise ?</span>
                <span>La tâche vous a-t-elle paru simple, nécessitant peu d'attention (Faible) ou complexe, nécessitant beaucoup d'attention (Élevée) ?</span>
            </div>
            <div class="flex w-full justify-evenly items-center space-x-4">
                <span>Faible</span>
                <div class="flex space-x-2 items-center">
                    {#each { length: 21 }, score}
                        <label class="text-sm">
                            <input 
                                type="radio"
                                bind:group={answers.exigenceMentale}
                                value={score}
                                on:change={() => logAnswer("exigence_mentale", score)}
                            >
                            {score}
                        </label>
                    {/each}
                </div>
                <span>Élevée</span>
            </div>
        </div> 

        <!-- Exigence physique -->
        <div class="flex flex-col items-center space-y-4">
            <h2 class="text-l font-semibold mb-2">Exigence physique</h2>
            <div class="flex flex-col">
                <span>Quelle a été l'importance de l'activité physique requise ?</span>
                <span>La tâche vous a-t-elle paru facile, peu fatigante, calme (Faible) ou pénible, fatigante, active (Élevée) ?</span>
            </div>
            <div class="flex w-full justify-evenly items-center space-x-4">
                <span>Faible</span>
                <div class="flex space-x-2 items-center">
                    {#each { length: 21 }, score}
                        <label class="text-sm">
                            <input 
                                type="radio"
                                bind:group={answers.exigencePhysique}
                                value={score}
                                on:change={() => logAnswer("exigence_physique", score)}
                            >
                            {score}
                        </label>
                    {/each}
                </div>
                <span>Élevée</span>
            </div>
        </div> 

        <!-- Exigence temporelle -->
        <div class="flex flex-col items-center space-y-4">
            <h2 class="text-l font-semibold mb-2">Exigence temporelle</h2>
            <div class="flex flex-col">
                <span>Quelle a été l'importance de la pression temporelle causée par la rapidité nécessitée pour l'accomplissement de la tâche ?</span>
                <span>Était-ce un rythme lent et tranquille (Faible) ou rapide et précipitée (Élevée) ?</span>
            </div>
            <div class="flex w-full justify-evenly items-center space-x-4">
                <span>Faible</span>
                <div class="flex space-x-2 items-center">
                    {#each { length: 21 }, score}
                        <label class="text-sm">
                            <input 
                                type="radio"
                                bind:group={answers.exigenceTemporelle}
                                value={score}
                                on:change={() => logAnswer("exigence_temporelle", score)}
                            >
                            {score}
                        </label>
                    {/each}
                </div>
                <span>Élevée</span>
            </div>
        </div> 

        <!-- Performance -->
        <div class="flex flex-col items-center space-y-4">
            <h2 class="text-l font-semibold mb-2">Performance</h2>
            <div class="flex flex-col">
                <span>Quelle réussite pensez-vous avoir eu dans l'accomplissement de votre tâche ?</span>
                <span>Comment pensez-vous avoir atteint les objectifs déterminés par la tâche ?</span>
            </div>
            <div class="flex w-full justify-evenly items-center space-x-4">
                <span>Faible</span>
                <div class="flex space-x-2 items-center">
                    {#each { length: 21 }, score}
                        <label class="text-sm">
                            <input 
                                type="radio"
                                bind:group={answers.performance}
                                value={score}
                                on:change={() => logAnswer("performance", score)}
                            >
                            {score}
                        </label>
                    {/each}
                </div>
                <span>Élevée</span>
            </div>
        </div> 

        <!-- Effort -->
        <div class="flex flex-col items-center space-y-4">
            <h2 class="text-l font-semibold mb-2">Effort</h2>
            <div class="flex flex-col">
                <span>Quel degré d'effort avez-vous dû fournir pour exécuter la tâche demandée (mentalement et physiquement) ?</span>
            </div>
            <div class="flex w-full justify-evenly items-center space-x-4">
                <span>Faible</span>
                <div class="flex space-x-2 items-center">
                    {#each { length: 21 }, score}
                        <label class="text-sm">
                            <input 
                                type="radio"
                                bind:group={answers.effort}
                                value={score}
                                on:change={() => logAnswer("effort", score)}
                            >
                            {score}
                        </label>
                    {/each}
                </div>
                <span>Élevée</span>
            </div>
        </div> 

        <!-- Frustration -->
        <div class="flex flex-col items-center space-y-4">
            <h2 class="text-l font-semibold mb-2">Frustration</h2>
            <div class="flex flex-col">
                <span>Pendant l'exécution du travail, vous êtes-vous senti satisfait, relaxé, sûr de vous (niveau de frustration faible), ou plutôt découragé, irrité, stressé, sans assurance (niveau de frustration élevé) ?</span>
            </div>
            <div class="flex w-full justify-evenly items-center space-x-4">
                <span>Faible</span>
                <div class="flex space-x-2 items-center">
                    {#each { length: 21 }, score}
                        <label class="text-sm">
                            <input 
                                type="radio"
                                bind:group={answers.frustration}
                                value={score}
                                on:change={() => logAnswer("frustration", score)}
                            >
                            {score}
                        </label>
                    {/each}
                </div>
                <span>Élevée</span>
            </div>
        </div> 

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