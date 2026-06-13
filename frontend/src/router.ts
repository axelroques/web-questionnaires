
import NameEntry from './pages/NameEntry.svelte';
import Dashboard from './pages/Dashboard.svelte';
import BigFive from './pages/BigFive.svelte';
import NASATLX from './pages/NASATLX.svelte';
import WAIS from './pages/WAIS.svelte';
import ISA from './pages/ISA.svelte';
import SAM from './pages/SAM.svelte';
import D2 from './pages/D2.svelte';


export const routes = {
    '/': NameEntry,
    '/dashboard': Dashboard,
    '/big-five': BigFive,
    '/d2': D2,
    '/wais': WAIS,
    '/sam': SAM,
    '/nasatlx': NASATLX,
    '/isa': ISA,
};