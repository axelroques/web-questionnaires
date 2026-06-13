
import type { ParticipantState } from '../lib/participant';
import { writable } from 'svelte/store';

// Try to recover the code from the previous session
const savedCode = typeof sessionStorage !== 'undefined'
    ? sessionStorage.getItem('participantCode') || ''
    : '';

const initialState: ParticipantState = {
    meta: {
        name: '',
        code: savedCode,
    },
    completed: {
        bigFive: false,
        d2: false,
        wais: false,
        sam: false,
        nasatlx: false,
        isa: false,
    },
};

export const participant = writable<ParticipantState>(initialState);