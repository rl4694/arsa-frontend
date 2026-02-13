# Constants
LOCAL_API = http://127.0.0.1:8000
PRODUCTION_API = https://arsa.pythonanywhere.com

# Environment variables
export VITE_BACKEND_URL=$(LOCAL_API)

# Targets
FORCE:

dev: FORCE
	npm run dev