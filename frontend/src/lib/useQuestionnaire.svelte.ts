
import { participant } from '../stores/participant';
import { submitQuestionnaire } from './api';
import { push } from 'svelte-spa-router';

export class Questionnaire {
    id: string;
    submitting = $state(false);
    error = $state('');

    constructor(questionnaireId: string) {
        this.id = questionnaireId;
    }

    async submit<T>(responseLog: T[], code: string) {
        if (this.submitting) return false;
        this.submitting = true;
        this.error = '';
        try {
            await submitQuestionnaire(code, this.id, responseLog);
            participant.update(p => ({
                ...p,
                completed: { ...p.completed, [this.id]: true }
            }));
            push('/dashboard');
            return true;
        } catch (e) {
            this.error = 'Submission failed. Please try again.';
            return false;
        } finally {
            this.submitting = false;
        }
    }
}