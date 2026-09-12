import math
from typing import List
from app.schemas import VariantCostData, PricingRecommendation

def calculate_pricing_recommendations(
    variants: List[VariantCostData],
    default_target_margin: float = 30.0
) -> List[PricingRecommendation]:
    """
    Dynamic Pricing Engine:
    Analyzes raw material BOM cost price changes against selling price
    and recommends price adjustments to maintain profit margin above target (>=30%).
    """
    recommendations: List[PricingRecommendation] = []

    for v in variants:
        cost_price = v.cost_price
        sell_price = v.current_sell_price
        target_margin = v.target_margin_percent or default_target_margin

        if sell_price <= 0:
            continue

        # Current margin percentage: ((Sell - Cost) / Sell) * 100
        if sell_price > 0:
            current_margin = ((sell_price - cost_price) / sell_price) * 100.0
        else:
            current_margin = 0.0

        current_margin = round(current_margin, 1)

        # Check if margin is below target threshold
        action_needed = current_margin < target_margin

        if action_needed:
            # Calculate price needed to achieve target margin
            # Sell = Cost / (1 - (Target / 100))
            margin_decimal = target_margin / 100.0
            if margin_decimal < 1.0:
                raw_rec_price = cost_price / (1.0 - margin_decimal)
            else:
                raw_rec_price = cost_price * 1.5

            # Round recommended price to nearest 500 IDR for clean consumer pricing
            recommended_sell_price = float(math.ceil(raw_rec_price / 500.0) * 500)
            if recommended_sell_price <= sell_price:
                recommended_sell_price = float(math.ceil((sell_price * 1.1) / 500.0) * 500)

            rec_margin = round(((recommended_sell_price - cost_price) / recommended_sell_price) * 100.0, 1)

            reason = (
                f"Margin saat ini ({current_margin}%) di bawah target minimum ({target_margin}%). "
                f"HPP resep sebesar Rp {cost_price:,.0f}. Disarankan menaikkan harga ke Rp {recommended_sell_price:,.0f} "
                f"untuk menjaga margin sehat di {rec_margin}%."
            )

            recommendations.append(
                PricingRecommendation(
                    variant_id=v.variant_id,
                    variant_name=v.variant_name,
                    current_sell_price=sell_price,
                    cost_price=cost_price,
                    current_margin_percent=current_margin,
                    recommended_sell_price=recommended_sell_price,
                    recommended_margin_percent=rec_margin,
                    reason=reason,
                    action_needed=True,
                )
            )

    # Sort recommendations by biggest margin gap first
    recommendations.sort(key=lambda x: x.current_margin_percent)

    return recommendations
