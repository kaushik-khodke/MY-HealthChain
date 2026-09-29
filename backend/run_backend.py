"""
run_backend.py
Launches Uvicorn FastAPI backend and Ngrok tunnel simultaneously.
"""

import os
import sys
import subprocess
import time
import signal
from dotenv import load_dotenv

try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

# Load environment variables
backend_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(backend_dir, "..", ".env"), override=True)
load_dotenv(os.path.join(backend_dir, ".env"), override=True)

PORT = os.getenv("PORT", "8000")
NGROK_DOMAIN = os.getenv("NGROK_DOMAIN", "relaxedly-unphonnetical-rowena.ngrok-free.dev")

processes = []

def cleanup(sig=None, frame=None):
    print("\n🛑 Shutting down Backend and Ngrok processes...")
    for p in processes:
        try:
            p.terminate()
            p.wait(timeout=2)
        except Exception:
            try:
                p.kill()
            except Exception:
                pass
    print("✅ All processes stopped successfully.")
    sys.exit(0)

# Register signal handlers
signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def main():
    print("==========================================")
    print("🚀 Starting Healthcare AI Backend + Ngrok")
    print("==========================================")

    # 1. Start Ngrok Tunnel
    ngrok_cmd = ["ngrok", "http", PORT]
    if NGROK_DOMAIN:
        ngrok_cmd.extend(["--domain", NGROK_DOMAIN])

    print(f"🌐 Launching Ngrok tunnel on port {PORT}...")
    try:
        ngrok_proc = subprocess.Popen(
            ngrok_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if sys.platform == "win32" else 0
        )
        processes.append(ngrok_proc)
        print(f"✅ Ngrok process started (PID {ngrok_proc.pid})")
        if NGROK_DOMAIN:
            print(f"🔗 Public URL: https://{NGROK_DOMAIN}")
            print(f"⚡ Webhook URL: https://{NGROK_DOMAIN}/place_order")
    except Exception as e:
        print(f"⚠️ Could not start Ngrok automatically: {e}")

    # 2. Start Uvicorn Backend
    uvicorn_cmd = [
        sys.executable, "-m", "uvicorn", "main:app",
        "--host", "0.0.0.0",
        "--port", PORT,
        "--reload",
        "--reload-dir", backend_dir
    ]
    print(f"⚙️ Launching Uvicorn backend on port {PORT}...")
    try:
        uvicorn_proc = subprocess.Popen(
            uvicorn_cmd,
            cwd=backend_dir
        )
        processes.append(uvicorn_proc)
        uvicorn_proc.wait()
    except KeyboardInterrupt:
        cleanup()
    except Exception as e:
        print(f"❌ Uvicorn server error: {e}")
        cleanup()

if __name__ == "__main__":
    main()
