#!/usr/bin/env python3
# ============================================================
# CAP Platform - Multi-Service Startup Orchestrator
# Starts Backend, AI Engine, and Frontend servers
# ============================================================

import subprocess
import time
import sys
import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.absolute()

def print_header(title):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70 + "\n")

def print_service(service_name, status, details=""):
    indicator = "[OK]" if "SUCCESS" in status or "Starting" in status else "[!]"
    print(f"{indicator} {service_name:30} {status:20} {details}")

def check_node():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        version = result.stdout.strip()
        print_service("Node.js", "FOUND", version)
        return True
    except:
        print_service("Node.js", "NOT FOUND", "Install from nodejs.org")
        return False

def check_npm():
    """Check if npm is installed"""
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        version = result.stdout.strip()
        print_service("npm", "FOUND", version)
        return True
    except:
        print_service("npm", "NOT FOUND", "Install with Node.js")
        return False

def check_python():
    """Check if Python 3 is installed"""
    try:
        result = subprocess.run(["python", "--version"], capture_output=True, text=True)
        version = result.stdout.strip()
        print_service("Python", "FOUND", version)
        return True
    except:
        print_service("Python", "NOT FOUND", "Install Python 3.8+")
        return False

def check_database():
    """Check PostgreSQL connection"""
    try:
        import psycopg2
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="postgres",
            connect_timeout=2
        )
        conn.close()
        print_service("PostgreSQL", "RUNNING", "on localhost:5432")
        return True
    except Exception as e:
        print_service("PostgreSQL", "NOT RUNNING", "Start PostgreSQL server")
        return False

def install_backend_deps():
    """Install backend dependencies"""
    backend_dir = PROJECT_ROOT / "backend"
    node_modules = backend_dir / "node_modules"
    
    if node_modules.exists():
        print_service("Backend deps", "CACHED", "node_modules found")
        return True
    
    print_service("Backend deps", "INSTALLING", "Running npm install...")
    try:
        subprocess.run(["npm", "install"], cwd=backend_dir, check=True, capture_output=True)
        print_service("Backend deps", "SUCCESS", "Dependencies installed")
        return True
    except:
        print_service("Backend deps", "FAILED", "npm install failed")
        return False

def install_frontend_deps():
    """Install frontend dependencies"""
    frontend_dir = PROJECT_ROOT / "frontend-web"
    node_modules = frontend_dir / "node_modules"
    
    if node_modules.exists():
        print_service("Frontend deps", "CACHED", "node_modules found")
        return True
    
    print_service("Frontend deps", "INSTALLING", "Running npm install...")
    try:
        subprocess.run(["npm", "install"], cwd=frontend_dir, check=True, capture_output=True)
        print_service("Frontend deps", "SUCCESS", "Dependencies installed")
        return True
    except:
        print_service("Frontend deps", "FAILED", "npm install failed")
        return False

def create_env_file():
    """Ensure .env file exists"""
    env_path = PROJECT_ROOT / ".env"
    if env_path.exists():
        print_service(".env file", "EXISTS", "Configuration ready")
        return True
    print_service(".env file", "MISSING", "Create .env before running")
    return False

def main():
    print_header("CAP PLATFORM - STARTUP CHECK")
    
    # Check prerequisites
    print("Checking prerequisites...\n")
    has_node = check_node()
    has_npm = check_npm()
    has_python = check_python()
    has_db = check_database()
    has_env = create_env_file()
    
    # Check dependencies installation
    print("\nChecking dependencies...\n")
    has_backend_deps = install_backend_deps() if has_npm else False
    has_frontend_deps = install_frontend_deps() if has_npm else False
    
    # Summary
    print_header("STARTUP INSTRUCTIONS")
    
    if not (has_node and has_npm and has_python):
        print("[!] Install missing prerequisites:")
        if not has_node:
            print("    - Node.js: https://nodejs.org")
        if not has_python:
            print("    - Python 3.8+: https://python.org")
        print()
        return False
    
    if not has_db:
        print("[!] PostgreSQL is not running.")
        print("    Start PostgreSQL and create the database:")
        print("    createdb cap_counseling")
        print()
        return False
    
    if not has_env:
        print("[!] .env file not found. Create it from .env.example")
        return False
    
    print("All prerequisites met! You can now start the services:\n")
    print("1. START AI ENGINE (Python):")
    print("   cd ai-engine")
    print("   python -m uvicorn api.main:app --reload --port 8000")
    print()
    print("2. START BACKEND (Node.js) [in new terminal]:")
    print("   cd backend")
    print("   npm run dev")
    print()
    print("3. START FRONTEND (React) [in new terminal]:")
    print("   cd frontend-web")
    print("   npm run dev")
    print()
    print("Then access:")
    print("  - Frontend:  http://localhost:5173")
    print("  - Backend:   http://localhost:3001")
    print("  - AI Engine: http://localhost:8000/docs")
    print()
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
