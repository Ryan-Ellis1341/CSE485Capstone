def summarize_variances(hotspots:list[dict])->str:
    if not hotspots:
        return "No significant variances detected."
    top = hotspots[0]
    a = top['account_std']
    sign = "higher than" if top['variance']>0 else "lower than"
    msg = f"Top variance: {a} was {sign} budget by {top['variance']:.0f}. "
    cogsv = next((h for h in hotspots if h['account_std'].lower().startswith('cogs')), None)
    if cogsv and cogsv['variance']>0:
        msg += "COGS pressure suggests margin squeeze; review pricing and supplier costs. "
    revv = next((h for h in hotspots if h['account_std'].lower().startswith('revenue')), None)
    if revv and revv['variance']<0:
        msg += "Revenue shortfall indicates demand or mix issues; consider promotions. "
    return msg.strip()