
export interface ParticipantState {
    meta: {
        name: string;
        code: string;
    };

    completed: {
        bigFive: boolean;
        d2: boolean;
        wais: boolean;
        sam: boolean;
        nasatlx: boolean;
        isa: boolean;
    };

}