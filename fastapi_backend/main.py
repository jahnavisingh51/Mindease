from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi_backend.controllers import auth_controller, dashboard_controller, mood_controller, chat_controller
from fastapi_backend.database.connection import engine, Base
from fastapi_backend.models import user, chat, mood
import logging
import time

# Create tables in the database (SQLAlchemy auto-creation)
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AI Mental Health Support SaaS",
    description="Backend API for AI-powered mental health support and mood tracking.",
    version="1.0.0"
)

# Set up logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configure CORS (Cross-Origin Resource Sharing)
# Allowing all origins for development as per requirements
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler for validation errors (400)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle validation errors and return a clearer message
    """
    error_details = []
    for error in exc.errors():
        # Get the field name that caused the error
        field = ".".join([str(p) for p in error.get("loc", [])])
        message = error.get("msg", "Unknown error")
        error_details.append({"field": field, "message": message})
    
    logger.error(f"Validation Error (400): {error_details}")
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "detail": "Invalid request body format",
            "errors": error_details,
            "message": "Please ensure you are sending the correct fields (e.g., fullName instead of full_name if required)"
        }
    )

# Register routers
app.include_router(auth_controller.router)
app.include_router(dashboard_controller.router)
app.include_router(mood_controller.router)
app.include_router(chat_controller.router)

# Middleware for request logging and response time monitoring
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Log incoming requests and monitor response time
    """
    start_time = time.time()
    request_details = f"Method: {request.method} Path: {request.url.path}"
    logger.info(f"Incoming Request: {request_details}")

    try:
        # Proceed with request handling
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Response Sent: {request_details} | Status: {response.status_code} | Duration: {process_time:.4f}s")
        return response
    except Exception as e:
        # Log critical errors clearly
        logger.error(f"Critical Request Failure: {request_details} | Error: {str(e)}")
        # Return generic error instead of letting it crash
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": f"An internal server error occurred: {str(e)}"}
        )

# Global health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Check if the API server is up and running
    """
    return {"status": "ok", "message": "Server is up and running"}

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Server status and version
    """
    return {
        "app_name": "AI Mental Health Support SaaS",
        "version": "1.0.0",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    # Log startup information
    logger.info("Starting AI Mental Health Support SaaS Backend...")
    # Run using uvicorn server
    # Port 3000 is often the standard for backend in this environment
    uvicorn.run(app, host="0.0.0.0", port=3000)