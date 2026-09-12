from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import config
from app.schemas import (
    ReorderRequest,
    ReorderRecommendation,
    VariantCostData,
    PricingRecommendation,
    FinancialSummaryData,
    HealthSummaryResponse,
    DashboardAnalyticsRequest,
    DashboardAnalyticsResponse,
)
from app.engines.reorder import calculate_reorder_recommendations
from app.engines.pricing import calculate_pricing_recommendations
from app.engines.health_summary import generate_health_summary
from typing import List

app = FastAPI(
    title="vvarsa AI Analytics Microservice",
    description="Intelligent AI Engine for Inventory Reorder Alerts, Dynamic Pricing & Business Health Summaries",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "vvarsa-ai-analytics",
        "environment": config.ENVIRONMENT,
        "version": "1.0.0",
    }

@app.post("/api/v1/reorder-alerts", response_model=List[ReorderRecommendation])
def get_reorder_alerts(payload: ReorderRequest):
    try:
        return calculate_reorder_recommendations(payload.ingredients, payload.lead_time_days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/pricing-recommendations", response_model=List[PricingRecommendation])
def get_pricing_recommendations(payload: List[VariantCostData]):
    try:
        return calculate_pricing_recommendations(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/health-summary", response_model=HealthSummaryResponse)
def get_business_health_summary(payload: FinancialSummaryData):
    try:
        return generate_health_summary(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/dashboard-analytics", response_model=DashboardAnalyticsResponse)
def get_dashboard_analytics(payload: DashboardAnalyticsRequest):
    """
    Combined single endpoint for Tenant Dashboard AI Analytics Widget
    """
    try:
        reorder_alerts = calculate_reorder_recommendations(payload.ingredients, payload.lead_time_days)
        pricing_recommendations = calculate_pricing_recommendations(payload.variants)
        health_summary = generate_health_summary(payload.financials)

        return DashboardAnalyticsResponse(
            reorder_alerts=reorder_alerts,
            pricing_recommendations=pricing_recommendations,
            health_summary=health_summary,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=config.HOST, port=config.PORT, reload=True)
