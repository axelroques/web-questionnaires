<script lang="ts">
    import { participant } from '../stores/participant';
    import { fetchResults } from '../lib/api';
    import { push } from 'svelte-spa-router';

    // CSV helpers
    function toCSV<T extends Record<string, any>>(rows: T[]): string {
        if (!rows.length) return '';
        const headers = Object.keys(rows[0]);
        const escape = (v: any) => `"${String(v).replace(/"/g, '""')}"`;
        const lines = [
            headers.join(','),
            ...rows.map(r => headers.map(h => escape(r[h])).join(','))
        ];
        return lines.join('\n');
    }

    function downloadCSV(filename: string, csv: string) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Generic exporter: fetches from backend, generates CSV, downloads
    async function exportQuestionnaire(
        questionnaire: string,
        filenamePrefix: string
    ) {
        const code = $participant.meta.code;
        if (!code) {
            alert('No participant code found.');
            return;
        }
        try {
            const data = await fetchResults(code);
            const responses = data?.results?.[questionnaire]?.responses;
            if (!responses || !responses.length) {
                alert(`No data yet for ${questionnaire}.`);
                return;
            }
            const csv = toCSV(responses);
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            downloadCSV(`${filenamePrefix}_${code}_${ts}.csv`, csv);
        } catch (err) {
            console.error(err);
            alert(`Failed to fetch ${questionnaire} data.`);
        }
    }

    // Thin wrappers for each questionnaire
    const exportBigFive = () => exportQuestionnaire('bigFive', 'bigfive');
    const exportD2 = () => exportQuestionnaire('d2', 'd2');
    const exportWAIS = () => exportQuestionnaire('wais', 'wais');
    const exportSAM = () => exportQuestionnaire('sam', 'sam');
    const exportNASATLX = () => exportQuestionnaire('nasatlx', 'NASATLX');
    const exportISA = () => exportQuestionnaire('isa', 'ISA');
</script>



<div class="bg-white p-6 rounded shadow w-full max-w-lg">
    <h1 class="text-xl font-semibold mb-2">Questionnaires</h1>

    {#if $participant.meta.code}
        <p class="mb-4">Participant: <strong>{$participant.meta.code}</strong></p>
    {/if}

    <div class="space-y-3">

        <!-- Big Five -->
        <div class="flex justify-between items-center">
            <button
                class="flex-7/8 px-4 py-2 rounded border"
                class:bg-green-500={$participant.completed.bigFive}
                class:text-white={$participant.completed.bigFive}
                on:click={() => push('/big-five')}
            >
                Big Five
                {#if $participant.completed.bigFive} ✓ {/if}
            </button>
            <button
                class="ml-2 flex flex-1/8 justify-center items-center p-2 rounded border"
                aria-label="Download csv"
                on:click={exportBigFive}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
            </button>
        </div>

        <!-- D2 -->
        <div class="flex justify-between items-center">
            <button
                class="flex-7/8 px-4 py-2 rounded border"
                class:bg-green-500={$participant.completed.d2}
                class:text-white={$participant.completed.d2}
                on:click={() => push('/d2')}
            >
                D2
                {#if $participant.completed.d2} ✓ {/if}
            </button>
            <button
                class="ml-2 flex flex-1/8 justify-center items-center p-2 rounded border"
                aria-label="Download csv"
                on:click={exportD2}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
            </button>
        </div>

        <!-- WAIS-IV -->
        <div class="flex justify-between items-center">
            <button
                class="flex-7/8 px-4 py-2 rounded border"
                class:bg-green-500={$participant.completed.wais}
                class:text-white={$participant.completed.wais}
                on:click={() => push('/wais')}
            >
                WAIS-IV
                {#if $participant.completed.wais} ✓ {/if}
            </button>
            <button
                class="ml-2 flex flex-1/8 justify-center items-center p-2 rounded border"
                aria-label="Download csv"
                on:click={exportWAIS}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
            </button>
        </div>

        <!-- SAM -->
        <div class="flex justify-between items-center">
            <button
                class="flex-7/8 px-4 py-2 rounded border"
                class:bg-green-500={$participant.completed.sam}
                class:text-white={$participant.completed.sam}
                on:click={() => push('/sam')}
            >
                SAM
                {#if $participant.completed.sam} ✓ {/if}
            </button>
            <button
                class="ml-2 flex flex-1/8 justify-center items-center p-2 rounded border"
                aria-label="Download csv"
                on:click={exportSAM}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
            </button>
        </div>

        <!-- NASA-TLX -->
        <div class="flex justify-between items-center">
            <button
                class="flex-7/8 px-4 py-2 rounded border"
                class:bg-green-500={$participant.completed.nasatlx}
                class:text-white={$participant.completed.nasatlx}
                on:click={() => push('/nasatlx')}
            >
                NASA-TLX
                {#if $participant.completed.nasatlx} ✓ {/if}
            </button>
            <button
                class="ml-2 flex flex-1/8 justify-center items-center p-2 rounded border"
                aria-label="Download csv"
                on:click={exportNASATLX}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
            </button>
        </div>

        <!-- ISA -->
        <div class="flex justify-between items-center">
            <button
                class="flex-7/8 px-4 py-2 rounded border"
                class:bg-green-500={$participant.completed.isa}
                class:text-white={$participant.completed.isa}
                on:click={() => push('/isa')}
            >
                ISA
                {#if $participant.completed.isa} ✓ {/if}
            </button>
            <button
                class="ml-2 flex flex-1/8 justify-center items-center p-2 rounded border"
                aria-label="Download csv"
                on:click={exportISA}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
            </button>
        </div>

    </div>
</div>