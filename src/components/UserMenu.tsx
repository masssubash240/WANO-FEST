import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

interface UserMenuProps {
  onOpenAuth?: (tab: "login" | "signup") => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onOpenAuth: _onOpenAuth }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "5px 14px 5px 5px", borderRadius: "30px",
          border: "1.5px solid rgba(0,229,255,0.35)",
          background: open ? "rgba(0,229,255,0.12)" : "rgba(255,255,255,0.05)",
          cursor: "pointer", transition: "all 0.25s ease",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#00e5ff"; }}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,229,255,0.35)"; }}
      >
        {user?.picture ? (
          <img src={user.picture} alt={user.name}
            style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #00e5ff" }}
          />
        ) : (
          <div style={{
            width: "30px", height: "30px", borderRadius: "50%",
            background: "linear-gradient(135deg, #00e5ff, #0077b6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.85rem", fontWeight: 900, color: "#fff",
          }}>
            {user?.name?.[0]?.toUpperCase() || "P"}
          </div>
        )}
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fff", letterSpacing: "0.04em", maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.name?.split(" ")[0]}
          </div>
          <div style={{ fontSize: "0.62rem", color: "rgba(0,229,255,0.7)", fontWeight: 700 }}>
            {user?.provider === "google" ? "● Google" : "● Email"}
          </div>
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", marginLeft: "2px", transform: open ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          minWidth: "210px", background: "rgba(6,10,22,0.98)",
          border: "1.5px solid rgba(0,229,255,0.25)", borderRadius: "16px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(0,229,255,0.1)",
          backdropFilter: "blur(20px)", overflow: "hidden", zIndex: 999,
          animation: "dropdownIn 0.2s ease",
        }}>
          {/* User info */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff" }}>{user?.name}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(200,220,255,0.5)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
          </div>

          {/* Menu items */}
          {[
            { icon: "⚓", label: "My Dashboard", action: () => { setOpen(false); } },
            { icon: "📋", label: "My Registrations", action: () => { setOpen(false); } },
            { icon: "🎟", label: "My Pass", action: () => { setOpen(false); } },
          ].map((item) => (
            <button key={item.label} onClick={item.action} style={{
              width: "100%", padding: "11px 16px", background: "transparent",
              border: "none", color: "rgba(230,240,255,0.8)", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "10px",
              fontSize: "0.82rem", fontWeight: 700, textAlign: "left",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,229,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(230,240,255,0.8)"; }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={async () => { await supabase.auth.signOut(); logout(); setOpen(false); }} style={{
              width: "100%", padding: "11px 16px", background: "transparent",
              border: "none", color: "#ff6b81", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "10px",
              fontSize: "0.82rem", fontWeight: 700, textAlign: "left",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(217,4,41,0.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
          <style>{`@keyframes dropdownIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
      )}
    </div>
  );
};
