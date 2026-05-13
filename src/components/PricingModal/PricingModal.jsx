import React from "react";
import { fireToast } from "../Toast/toast";

function PricingModal({ onClose }) {
  const handleUpgrade = (planName) => {
    fireToast(`Redirecting to payment gateway for ${planName}...`, "success");
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const tiers = [
    {
      name: "Basic",
      price: "Free",
      period: "Forever",
      description: "Everything you need to track basic finances.",
      features: [
        "Unlimited Transactions",
        "Basic Analytics",
        "Local Storage Sync",
        "Standard Support"
      ],
      buttonText: "Current Plan",
      buttonPrimary: false,
      onClick: () => fireToast("You are already on the Basic plan.", "info")
    },
    {
      name: "Pro",
      price: "₹199",
      period: "per month",
      description: "Advanced tools for power users and budgeting.",
      features: [
        "Unlimited Custom Categories",
        "Advanced AI Insights",
        "Recurring Transactions",
        "Cloud Sync (Soon)"
      ],
      buttonText: "Upgrade to Pro",
      buttonPrimary: true,
      popular: true,
      onClick: () => handleUpgrade("Pro")
    },
    {
      name: "Lifetime",
      price: "₹4999",
      period: "once",
      description: "Pay once, unlock everything forever.",
      features: [
        "Everything in Pro",
        "Priority 24/7 Support",
        "Early Access to Features",
        "No Recurring Fees"
      ],
      buttonText: "Get Lifetime",
      buttonPrimary: false,
      onClick: () => handleUpgrade("Lifetime")
    }
  ];

  return (
    <div className="et-modal-overlay show">
      <div className="et-modal" style={{ maxWidth: "900px", width: "95%", padding: "40px" }}>
        <div style={{ position: "absolute", top: "20px", right: "20px" }}>
          <button className="et-modal-close" onClick={onClose} style={{ fontSize: "24px", background: "transparent", border: "none", color: "var(--et-muted)", cursor: "pointer" }}>×</button>
        </div>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", marginBottom: "10px", color: "var(--et-text)" }}>Unlock Your Financial Potential</h2>
          <p style={{ color: "var(--et-muted)", fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>Choose the plan that fits your needs. Upgrade anytime.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", alignItems: "stretch" }}>
          {tiers.map((tier, idx) => (
            <div key={idx} style={{ 
              position: "relative",
              backgroundColor: "var(--et-surface2)", 
              border: `2px solid ${tier.popular ? "var(--et-accent)" : "var(--et-border)"}`, 
              borderRadius: "16px", 
              padding: "30px 20px", 
              display: "flex", 
              flexDirection: "column",
              boxShadow: tier.popular ? "0 10px 30px rgba(245,200,66,0.15)" : "none",
              transform: tier.popular ? "scale(1.03)" : "none",
              zIndex: tier.popular ? 2 : 1
            }}>
              {tier.popular && (
                <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "var(--et-accent)", color: "#000", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Most Popular
                </div>
              )}
              
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px", color: "var(--et-text)" }}>{tier.name}</h3>
              <div style={{ marginBottom: "15px" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: "bold", fontFamily: "'Playfair Display', serif", color: "var(--et-text)" }}>{tier.price}</span>
                <span style={{ fontSize: "0.9rem", color: "var(--et-muted)", marginLeft: "5px" }}>{tier.period}</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--et-muted)", marginBottom: "25px", lineHeight: "1.5" }}>{tier.description}</p>
              
              <div style={{ flex: 1, marginBottom: "30px" }}>
                {tier.features.map((feature, fIdx) => (
                  <div key={fIdx} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", fontSize: "0.9rem", color: "var(--et-text)" }}>
                    <span style={{ color: "var(--et-success)" }}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>

              <button 
                onClick={tier.onClick}
                style={{ 
                  width: "100%", 
                  padding: "14px", 
                  borderRadius: "12px", 
                  border: tier.buttonPrimary ? "none" : "1px solid var(--et-border)", 
                  background: tier.buttonPrimary ? "var(--et-accent)" : "transparent", 
                  color: tier.buttonPrimary ? "#000" : "var(--et-text)", 
                  fontSize: "1rem", 
                  fontWeight: "700", 
                  cursor: "pointer", 
                  transition: "all 0.2s" 
                }}
                onMouseOver={(e) => {
                  if (tier.buttonPrimary) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 22px rgba(245,200,66,0.28)";
                  } else {
                    e.currentTarget.style.borderColor = "var(--et-accent)";
                    e.currentTarget.style.color = "var(--et-accent)";
                  }
                }}
                onMouseOut={(e) => {
                  if (tier.buttonPrimary) {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  } else {
                    e.currentTarget.style.borderColor = "var(--et-border)";
                    e.currentTarget.style.color = "var(--et-text)";
                  }
                }}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingModal;
