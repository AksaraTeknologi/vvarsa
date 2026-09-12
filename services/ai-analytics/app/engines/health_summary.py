import os
import json
import httpx
from app.schemas import FinancialSummaryData, HealthSummaryResponse
from app.config import config

def generate_health_summary(data: FinancialSummaryData) -> HealthSummaryResponse:
    """
    Generate Business Health Summary executive narrative.
    Tries Google Gemini API if API key is provided, otherwise generates a smart structured analysis.
    """
    sales = data.weekly_sales
    expenses = data.weekly_expenses
    net = data.net_profit or (sales - expenses)
    margin = (net / sales * 100) if sales > 0 else 0

    # Calculate overall health score (0 - 100)
    score = 70  # Baseline
    if margin >= 25:
        score += 15
    elif margin >= 10:
        score += 5
    elif margin < 0:
        score -= 25

    if data.sales_trend_pct > 0:
        score += 10
    elif data.sales_trend_pct < -10:
        score -= 10

    if data.low_stock_count == 0:
        score += 5
    elif data.low_stock_count > 3:
        score -= 10

    score = max(10, min(100, score))

    if score >= 80:
        status_badge = "excellent"
    elif score >= 60:
        status_badge = "good"
    else:
        status_badge = "needs_attention"

    # Attempt Gemini API call if key is set
    if config.GEMINI_API_KEY:
        try:
            api_summary = call_gemini_api(data, score, margin)
            if api_summary:
                return api_summary
        except Exception as e:
            print(f"[AI Health Summary] Gemini API call failed, using rule engine: {e}")

    # Smart Rule-Based Engine Narrative Fallback
    if net > 0:
        headline = f"Kondisi keuangan bisnis Anda minggu ini sangat baik dengan total penjualan Rp {sales:,.0f} dan laba bersih Rp {net:,.0f} (Margin: {margin:.1f}%)."
    elif net == 0 and sales == 0:
        headline = "Belum ada catatan transaksi signifikan minggu ini. Mulai catat pesanan di POS untuk analisis performa yang lebih akurat."
    else:
        headline = f"Perhatian: Pengeluaran minggu ini (Rp {expenses:,.0f}) melebihi pendapatan (Rp {sales:,.0f}), menghasilkan defisit Rp {abs(net):,.0f}."

    takeaways = []
    if margin >= 20:
        takeaways.append(f"Margin keuntungan bersih berada di tingkat sehat ({margin:.1f}%).")
    elif margin > 0:
        takeaways.append(f"Margin keuntungan bersih cukup ketat ({margin:.1f}%), disarankan mengevaluasi biaya operasional.")
    else:
        takeaways.append("Laba bersih negatif minggu ini. Periksa pengeluaran atau tinjau kembali strategi harga jual.")

    if data.low_stock_count > 0:
        takeaways.append(f"Terdapat {data.low_stock_count} bahan baku dalam kondisi stok kritis atau di bawah batas minimum.")
    else:
        takeaways.append("Stok bahan baku terpantau aman dan terkendali.")

    if data.sales_trend_pct > 0:
        takeaways.append(f"Tren penjualan meningkat +{data.sales_trend_pct:.1f}% dibandingkan periode sebelumnya.")

    actionable_tips = [
        "Jaga ketersediaan bahan baku utama agar pesanan pelanggan tidak tertunda.",
        "Pantau kenaikan harga dari supplier dan sesuaikan harga jual varian bila perlu."
    ]

    return HealthSummaryResponse(
        narrative_summary=headline,
        health_score=score,
        status_badge=status_badge,
        key_takeaways=takeaways,
        actionable_tips=actionable_tips
    )

def call_gemini_api(data: FinancialSummaryData, score: int, margin: float) -> HealthSummaryResponse:
    """Call Google Gemini REST API directly"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={config.GEMINI_API_KEY}"

    prompt = f"""
    Anda adalah konsultan bisnis dan CFO AI terkemuka untuk bisnis UMKM/Retail/FnB.
    Analisis data keuangan berikut dan berikan narasi eksekutif singkat & profesional dalam Bahasa Indonesia.

    Data Keuangan:
    - Total Penjualan: Rp {data.weekly_sales:,.0f}
    - Total Pengeluaran: Rp {data.weekly_expenses:,.0f}
    - Laba Bersih: Rp {data.net_profit:,.0f}
    - Profit Margin: {margin:.1f}%
    - Tren Penjualan: {data.sales_trend_pct:.1f}%
    - Bahan Baku Stok Kritis: {data.low_stock_count} produk
    - Total Pesanan: {data.total_orders_count}

    Format respon HARUS dalam bentuk JSON murni dengan atribut:
    {{
        "narrative_summary": "1-2 kalimat ringkasan kondisi bisnis",
        "key_takeaways": ["Poin 1", "Poin 2", "Poin 3"],
        "actionable_tips": ["Saran aksi 1", "Saran aksi 2"]
    }}
    """

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"response_mime_type": "application/json"}
    }

    with httpx.Client(timeout=10.0) as client:
        res = client.post(url, json=payload)
        if res.status_code == 200:
            res_data = res.json()
            raw_text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            
            cleaned_text = raw_text.strip()
            if cleaned_text.startswith("```"):
                lines = cleaned_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                cleaned_text = "\n".join(lines).strip()

            parsed = json.loads(cleaned_text)

            status_badge = "excellent" if score >= 80 else ("good" if score >= 60 else "needs_attention")

            return HealthSummaryResponse(
                narrative_summary=parsed.get("narrative_summary", ""),
                health_score=score,
                status_badge=status_badge,
                key_takeaways=parsed.get("key_takeaways", []),
                actionable_tips=parsed.get("actionable_tips", [])
            )
    return None
