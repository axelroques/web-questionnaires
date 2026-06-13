
from db import get_db, init_db

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json

import logging
# Configure logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/api/session/start', methods=['POST'])
def start_session():
    data = request.get_json()
    code = data['code']
    name = data.get('name', '')
    with get_db() as conn:
        try:
            conn.execute(
                'INSERT INTO sessions (code, name) VALUES (?, ?)',
                (code, name)
            )
            session_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
        except sqlite3.IntegrityError:
            # code already exists, fetch existing session
            row = conn.execute('SELECT id FROM sessions WHERE code = ?', (code,)).fetchone()
            session_id = row['id']
    return jsonify({'session_id': session_id, 'code': code})

@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.get_json()
    code = data['code']
    questionnaire = data['questionnaire']
    responses = json.dumps(data['responses'])

    with get_db() as conn:
        session = conn.execute('SELECT id FROM sessions WHERE code = ?', (code,)).fetchone()
        if not session:
            return jsonify({'error': 'Unknown session code'}), 404
        conn.execute(
            'INSERT INTO submissions (session_id, questionnaire, responses) VALUES (?, ?, ?)',
            (session['id'], questionnaire, responses)
        )
    return jsonify({'status': 'ok'})

@app.route('/api/results/<code>')
def get_results(code):
    with get_db() as conn:
        session = conn.execute('SELECT * FROM sessions WHERE code = ?', (code,)).fetchone()
        if not session:
            return jsonify({'error': 'Not found'}), 404
        rows = conn.execute(
            'SELECT questionnaire, responses, submitted_at FROM submissions WHERE session_id = ?',
            (session['id'],)
        ).fetchall()
    results = {}
    for row in rows:
        results[row['questionnaire']] = {
            'responses': json.loads(row['responses']),
            'submitted_at': row['submitted_at']
        }
    return jsonify({'name': session['name'], 'results': results})


if __name__ == '__main__':

    logger.info("Initializing database...")
    init_db()
    logger.info("Database initialized successfully.")

    app.run(debug=True, port=5000)