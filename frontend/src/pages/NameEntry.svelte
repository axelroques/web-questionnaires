<script lang="ts">
    import { participant } from '../stores/participant';
    import { startSession } from '../lib/api';
    import { push } from 'svelte-spa-router';

    let participantCode = '';
    let submitting = false;
    let error = '';

    async function submit() {
        if (!participantCode || submitting) return;
        submitting = true;
        error = '';
        try {
            // Register session with the backend
            await startSession(participantCode, '');
            // Update local store
            participant.update(p => ({
                ...p,
                meta: { ...p.meta, code: participantCode }
            }));
            push('/dashboard');
        } catch (err) {
            error = 'Could not connect to server. Make sure the backend is running.';
            console.error(err);
        } finally {
            submitting = false;
        }
    }
</script>

<div class="bg-white p-6 rounded shadow w-full max-w-md">
    <h1 class="text-xl font-semibold mb-4">Informations</h1>
    <input
        class="border w-full p-2 mb-4"
        placeholder="Code participant"
        bind:value={participantCode}
    />
    {#if error}
        <p class="text-red-600 text-sm mb-4">{error}</p>
    {/if}
    <button
        class="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        on:click={submit}
        disabled={!participantCode || submitting}
    >
        {submitting ? 'Connexion...' : 'Valider'}
    </button>
</div>