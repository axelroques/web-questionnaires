
import subprocess
import signal
import time
import sys
import os


import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def start_process(cmd, cwd, label):
    return subprocess.Popen(
        cmd,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        preexec_fn=os.setsid if os.name != 'nt' else None
    )

def stream_output(proc, prefix):
    for line in proc.stdout:
        print(f"[{prefix}] {line.rstrip()}")

def cleanup(signum, frame):
    print("\nShutting down...")
    # Terminate process groups
    if os.name != 'nt':
        os.killpg(os.getpgid(flask.pid), signal.SIGTERM)
        os.killpg(os.getpgid(frontend.pid), signal.SIGTERM)
    else:
        flask.terminate()
        frontend.terminate()
    sys.exit(0)


if __name__ == '__main__':

    # Commands to run
    flask_cmd = [sys.executable, "app.py"]
    frontend_cmd = ["npm", "run", "dev"]

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    # Start web app
    flask = start_process(flask_cmd, "backend", "Flask")
    frontend = start_process(frontend_cmd, "frontend", "Vite")

    print("Development servers started: Flask (port 5000), Vite (port 5173)")
    print("Press Ctrl+C to stop both.\n")

    try:
        # Use separate threads to interleave output
        from threading import Thread
        Thread(target=stream_output, args=(flask, "Flask"), daemon=True).start()
        Thread(target=stream_output, args=(frontend, "Vite"), daemon=True).start()
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        cleanup(None, None)