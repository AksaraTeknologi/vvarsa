from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Union

class IngredientStockData(BaseModel):
    product_id: Union[int, str]
    product_name: str
    current_stock: float
    min_stock: float
    unit: str
    daily_usage_avg: float = Field(default=0.0, description="Average daily usage calculated from past 30 days orders")
    cost_price: float = Field(default=0.0)

class ReorderRequest(BaseModel):
    ingredients: List[IngredientStockData]
    lead_time_days: int = Field(default=3, description="Estimated supplier delivery lead time in days")

class ReorderRecommendation(BaseModel):
    product_id: Union[int, str]
    product_name: str
    current_stock: float
    min_stock: float
    unit: str
    daily_usage_avg: float
    days_until_depleted: float
    recommended_reorder_qty: float
    urgency: Literal["critical", "warning", "normal"]
    reason: str

class VariantCostData(BaseModel):
    variant_id: Union[int, str]
    variant_name: str
    current_sell_price: float
    cost_price: float = Field(description="BOM Recipe Cost Price")
    current_margin_percent: Optional[float] = None
    target_margin_percent: float = Field(default=30.0)

class PricingRecommendation(BaseModel):
    variant_id: Union[int, str]
    variant_name: str
    current_sell_price: float
    cost_price: float
    current_margin_percent: float
    recommended_sell_price: float
    recommended_margin_percent: float
    reason: str
    action_needed: bool

class FinancialSummaryData(BaseModel):
    period: str = Field(default="weekly")
    weekly_sales: float = Field(default=0.0)
    weekly_expenses: float = Field(default=0.0)
    net_profit: float = Field(default=0.0)
    sales_trend_pct: float = Field(default=0.0)
    low_stock_count: int = Field(default=0)
    total_orders_count: int = Field(default=0)
    top_selling_variants: List[str] = Field(default_factory=list)

class HealthSummaryResponse(BaseModel):
    narrative_summary: str
    health_score: int = Field(description="Health score out of 100")
    status_badge: Literal["excellent", "good", "needs_attention"]
    key_takeaways: List[str]
    actionable_tips: List[str]

class DashboardAnalyticsRequest(BaseModel):
    ingredients: List[IngredientStockData] = Field(default_factory=list)
    variants: List[VariantCostData] = Field(default_factory=list)
    financials: FinancialSummaryData = Field(default_factory=FinancialSummaryData)
    lead_time_days: int = Field(default=3)

class DashboardAnalyticsResponse(BaseModel):
    reorder_alerts: List[ReorderRecommendation]
    pricing_recommendations: List[PricingRecommendation]
    health_summary: HealthSummaryResponse
