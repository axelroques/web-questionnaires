
import type { 
    BigFiveResponseEvent, D2ResponseEvent, 
    WAISResponseEvent, SAMResponseEvent, 
    ISAResponseEvent, NASATLXResponseEvent
} from "./event";

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