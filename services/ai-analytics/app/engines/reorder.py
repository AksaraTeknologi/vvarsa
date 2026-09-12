import math
from typing import List
from app.schemas import IngredientStockData, ReorderRecommendation

def calculate_reorder_recommendations(
    ingredients: List[IngredientStockData],
    lead_time_days: int = 3
) -> List[ReorderRecommendation]:
    """
    Calculate Smart Reorder Point based on daily usage rate from 30 days order history
    and supplier delivery lead time.
    """
    recommendations: List[ReorderRecommendation] = []

    for ing in ingredients:
        daily_usage = max(ing.daily_usage_avg, 0.0)
        current_stock = ing.current_stock
        min_stock = ing.min_stock

        # Calculate days until stock is depleted
        if daily_usage > 0:
            days_until_depleted = round(current_stock / daily_usage, 1)
        else:
            days_until_depleted = 999.0

        # Reorder Point (ROP) = (Daily Usage * Lead Time) + Safety Buffer (min_stock)
        reorder_point = (daily_usage * lead_time_days) + min_stock

        is_below_min = current_stock <= min_stock
        is_below_rop = current_stock <= reorder_point
        is_depleting_soon = days_until_depleted <= (lead_time_days + 3)

        if is_below_min or is_below_rop or is_depleting_soon:
            # Urgency level assessment
            if current_stock <= (min_stock * 0.5) or days_until_depleted <= 2:
                urgency = "critical"
            elif current_stock <= min_stock or days_until_depleted <= 4:
                urgency = "warning"
            else:
                urgency = "normal"

            # Recommended order quantity: Target stock for next 7-10 days
            target_buffer = max(daily_usage * (lead_time_days + 7), min_stock * 1.5)
            recommended_qty = math.ceil(max(target_buffer - current_stock, min_stock))

            if days_until_depleted < 999:
                reason = f"Laju pemakaian {daily_usage:.1f} {ing.unit}/hari. Stok diperkirakan habis dalam {days_until_depleted} hari."
            else:
                reason = f"Stok saat ini ({current_stock} {ing.unit}) telah mencapai atau di bawah batas minimum ({min_stock} {ing.unit})."

            recommendations.append(
                ReorderRecommendation(
                    product_id=ing.product_id,
                    product_name=ing.product_name,
                    current_stock=current_stock,
                    min_stock=min_stock,
                    unit=ing.unit,
                    daily_usage_avg=daily_usage,
                    days_until_depleted=days_until_depleted,
                    recommended_reorder_qty=float(recommended_qty),
                    urgency=urgency,
                    reason=reason,
                )
            )

    # Sort recommendations by urgency: critical first, then warning
    urgency_weights = {"critical": 0, "warning": 1, "normal": 2}
    recommendations.sort(key=lambda x: (urgency_weights.get(x.urgency, 2), x.days_until_depleted))

    return recommendations
