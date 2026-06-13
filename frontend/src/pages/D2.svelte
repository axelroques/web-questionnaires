<script lang="ts">
    import { Questionnaire } from '../lib/useQuestionnaire.svelte';
    import D2Button from '../components/D2Button.svelte';
    import { participant } from '../stores/participant';
    import type { D2ResponseEvent } from '../lib/event';
    import { lines } from '../assets/d2';

    // Generic questionnaire imports
    const q = new Questionnaire('d2');
    
    // Local questionnaire logic
    let responseLog: D2ResponseEvent[] = [];
    let started = false;
    let startTime: number | null = null;
    let activeLine: number | null = 0;
    let lineStartTime: number | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let clicked = new Set<number>();
    let allClicked = new Map<number, Set<number>>(); 
    let showCorrection = false;

    function startQuestionnaire() {
        startTime = Date.now();
        started = true;
        startLine(0);
        responseLog.push({
            t: startTime,
            line: null,
            pos: null,
            letter: null,
            upper: null,
            below: null,
            action: null
        });
    }
    
    function startLine(index: number) {
        lineStartTime = Date.now();
        activeLine = index;

        // Clear previous timer
        if (timer) clearTimeout(timer);

        // 20s timer per line
        timer = setTimeout(() => {
            advanceLine();
        }, 20_000);
    }

    function advanceLine() {
        allClicked.set(activeLine!, new Set(clicked));
        clicked = new Set();

        if (activeLine! < lines.length - 1) {
            startLine(activeLine! + 1);
        } else {
            // Show correction
            activeLine = null;
            showCorrection = true;
        }
    }

    function logClick(
        lineIndex: number,
        position: number,
        letter: string,
        upper: number,
        below: number
    ) {
        if (lineIndex !== activeLine || !lineStartTime) return;

        // Creating a new identical set so Svelte can react
        clicked = new Set(clicked);
        const action = clicked.has(position) ? 'unselect' : 'select';
        if (action === 'select') clicked.add(position);
        else clicked.delete(position);

        responseLog.push({
            t: Date.now(),
            line: lineIndex,
            pos: position,
            letter,
            upper,
            below,
            action
        });
    }

    // Correction
    function isTarget(l: { letter: string; upper: number; below: number }) {
        return l.letter === 'd' && l.upper + l.below === 2;
    }
    function wasClicked(lineIndex: number, pos: number) {
        return allClicked.get(lineIndex)?.has(pos) ?? false;
    }
    function correctionStatus(
        lineIndex: number,
        pos: number,
        l: { letter: string; upper: number; below: number }
    ): 'green' | 'orange' | 'red' | null {
        if (!showCorrection) return null;

        const target = isTarget(l);
        const clickedByUser = wasClicked(lineIndex, pos);

        // if (target && clickedByUser) return 'green';   // correct hit
        // if (target && !clickedByUser) return 'orange'; // miss
        // if (!target && clickedByUser) return 'red';    // false alarm
        // Hide correction for now
        if (target && clickedByUser) return null;   // correct hit
        if (target && !clickedByUser) return null; // miss
        if (!target && clickedByUser) return null;    // false alarm

        return null;
    }
    
    async function finish() {
        await q.submit(responseLog, $participant.meta.code);
    }

</script>

<div class="bg-white p-6 rounded shadow w-full max-w-7/8">
    
    {#if !started}
        <!-- Instructions -->
        <h1 class="text-xl font-semibold mb-4">Test d'attention D2</h1>

        <div class="mb-6 text-gray-600 italic">
            <p class="font-bold">Instructions :</p>
            <div class="text-sm">
                <p>Barrer chaque "d" qui est accompagné de deux traits :</p>
                <div class="flex justify-evenly items-center text-2xl font-[Arial] font-serif not-italic">
                    <div class="flex flex-col jutify-center items-center">
                        <D2Button 
                            letter={"d"} upper={2} below={0} 
                            clicked={false}
                            onClick={() => null}
                            correction={null}
                        />
                        <span class="text-xs">2 traits en haut</span>
                        <span class="text-xs">⠀</span>
                    </div>
                    
                    <div class="flex flex-col jutify-center items-center">
                        <D2Button 
                            letter={"d"} upper={0} below={2} 
                            clicked={false}
                            onClick={() => null}
                            correction={null}
                        />
                        <span class="text-xs">2 traits en bas</span>
                        <span class="text-xs">⠀</span>
                    </div>

                    <div class="flex flex-col jutify-center items-center">
                        <D2Button 
                            letter={"d"} upper={1} below={1} 
                            clicked={false}
                            onClick={() => null}
                            correction={null}
                        />
                        <span class="text-xs">1 trait en haut</span>
                        <span class="text-xs">1 trait en bas</span>
                    </div>
                </div>
            </div>

            <div class="text-sm pt-4">
                <p>Ne pas barrer :</p>
                <div class="flex flex-col">
                    <div class="flex justify-evenly items-center text-2xl font-[Arial] font-serif not-italic px-4">
                        <span class="w-1/4 text-xs">"d" avec moins ou plus de 2 traits :</span>
                        <div class="w-3/4 flex justify-evenly items-center">
                            <D2Button 
                                letter={"d"} upper={1} below={0} 
                                clicked={false}
                                onClick={() => null}
                                correction={null}
                            />
                            <D2Button 
                                letter={"d"} upper={0} below={1} 
                                clicked={false}
                                onClick={() => null}
                                correction={null}
                            />
                            <D2Button 
                                letter={"d"} upper={1} below={2} 
                                clicked={false}
                                onClick={() => null}
                                correction={null}
                            />
                            <D2Button 
                                letter={"d"} upper={2} below={1} 
                                clicked={false}
                                onClick={() => null}
                                correction={null}
                            />
                            <D2Button 
                                letter={"d"} upper={2} below={2} 
                                clicked={false}
                                onClick={() => null}
                                correction={null}
                            />
                        </div>
                    </div>

                    <div class="flex justify-evenly items-center text-2xl font-[Arial] font-serif not-italic px-4 pt-4">
                        <span class="w-1/4 text-xs">"p" quelque soit le nombre de traits :</span>
                        <div class="w-3/4 flex justify-evenly items-center">
                            <D2Button 
                                letter={"p"} upper={0} below={2} 
                                clicked={false}
                                onClick={() => null}
                                correction={null}
                            />
                            <D2Button 
                                letter={"p"} upper={1} below={1} 
                                clicked={false}
                                onClick={() => null}
                                correction={null}
                            />
                            <D2Button 
                                letter={"p"} upper={2} below={0} 
                                clicked={false}
                                onClick={() => null}
                                correction={null}
                            />
                            <D2Button 
                                letter={"p"} upper={1} below={0} 
                                clicked={false}
                                onClick={() => null}
                                correction={null}
                            />
                            <D2Button 
                                letter={"p"} upper={0} below={1} 
                                clicked={false}
                                onClick={() => null}
                                correction={null}
                            />
                        </div>
                    </div>
                </div>
                
            </div>
        </div>

    <!-- Start button -->
        <button
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            on:click={startQuestionnaire}
        >
            Commencer
        </button>
    {/if}

    <!-- Questionnaire -->
    {#if started}
        <div class="mb-6 text-2xl font-[Arial] font-serif">
            {#each lines as line, lineIndex}
                <div 
                    class="flex justify-evenly items-center gap-x-2 transition-opacity mb-2"
                    class:opacity-30={lineIndex !== activeLine}
                    class:pointer-events-none={lineIndex !== activeLine}
                >
                    <span class="text-base mr-2">{lineIndex+1}.</span>
                    {#each line as l, pos}
                        <D2Button 
                            letter={l.letter} 
                            upper={l.upper} 
                            below={l.below} 
                            clicked={
                                showCorrection
                                    ? wasClicked(lineIndex, pos)
                                    : lineIndex === activeLine && clicked.has(pos)
                            }
                            onClick={() => logClick(lineIndex, pos, l.letter, l.upper, l.below)}
                            correction={correctionStatus(lineIndex, pos, l)}
                        />
                    {/each}
                </div>
            {/each}
            
        </div>
        
        {#if showCorrection}
            <button
                class="bg-blue-600 text-white px-4 py-2 rounded mt-6"
                on:click={finish}
            >
                {q.submitting ? 'Envoi...' : 'Valider'}
            </button>
         {/if}

         {#if q.error}
            <p class="text-red-600 text-sm mt-2">{q.error}</p>
        {/if}

    {/if}
    
</div>