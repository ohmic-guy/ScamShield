from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routes.complaints import router as complaints_router
from routes.auth import router as auth_router
from routes.alerts import router as alerts_router
from routes.analytics import router as analytics_router
from Database.database import check_db_connection, init_db

# Initialize FastAPI app
app = FastAPI(
    title="Cyber Fraud Support System API",
    description="API for managing cyber fraud complaints and alerts",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(complaints_router, prefix="/api/complaints", tags=["Complaints"])
app.include_router(alerts_router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    print("Starting Cyber Fraud Support System API...")
    if not os.path.exists("cyber_fraud.db"):
        print("Initializing database...")
        init_db()
    if check_db_connection():
        print("✓ Database connection successful")
    else:
        print("✗ Database connection failed")

@app.get("/")
async def root():
    """Root endpoint - API info"""
    return {
        "message": "Cyber Fraud Support System API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    db_status = "healthy" if check_db_connection() else "unhealthy"
    return {
        "status": "ok",
        "database": db_status
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    print(f"Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=os.getenv("ENV", "development") == "development"
    )
