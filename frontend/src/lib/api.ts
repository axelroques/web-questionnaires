
const BASE = 'http://localhost:5000';   // Flask dev server

export async function startSession(code: string, name: string) {
    const res = await fetch(`${BASE}/api/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name })
    });
    return res.json();
}

export async function submitQuestionnaire(
    code: string,
    questionnaire: string,
    responses: any[]   // keep your typed events
) {
    const res = await fetch(`${BASE}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, questionnaire, responses })
    });
    return res.json();
}

export async function fetchResults(code: string) {
    const res = await fetch(`${BASE}/api/results/${code}`);
    return res.json();
}