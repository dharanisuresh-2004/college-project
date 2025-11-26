import React from "react";

export default function ErrorPage() {
    const goHome = () => (window.location.href = "/");

    return (
        <div style={styles.page}>
            <div style={styles.card}  aria-labelledby="title">
                <div style={styles.visual}>
                    <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
                        <g fill="none" stroke="currentColor" strokeWidth="3">
                            <rect x="6" y="18" width="108" height="78" rx="8" strokeOpacity="0.12" />
                            <path d="M20 36h80" strokeOpacity="0.12" />
                            <circle cx="38" cy="54" r="10" strokeOpacity="0.12" />
                            <path d="M68 48l18 18M86 48l-18 18" strokeLinecap="round" strokeOpacity="0.18" />
                        </g>
                    </svg>
                </div>

                <div style={styles.content}>
                    <h1 id="title" style={styles.code}>404</h1>
                    <h2 style={styles.head}>Page not found</h2>
                    <p style={styles.text}>
                        The page you are looking for doesn't exist or has been moved. Check the URL
                        or go back to the homepage.
                    </p>
                    <div style={styles.actions}>
                        <button onClick={goHome} style={styles.primary}>Go to homepage</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.08), transparent), linear-gradient(180deg, #0f172a 0%, #071033 100%)",
        color: "#e6eef8",
        padding: "0px",
        boxSizing: "border-box",
        border: "none",
        margin: "none",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    card: {
        maxWidth: 920,
        width: "100%",
        display: "flex",
        gap: "28px",
        padding: "28px",
        borderRadius: "14px",
        alignItems: "center",
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
        boxShadow: "0 8px 40px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(6px)",
    },
    visual: {
        minWidth: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#7c9eff",
    },
    content: {
        flex: 1,
    },
    code: {
        margin: 0,
        fontSize: "84px",
        lineHeight: 1,
        letterSpacing: "-4px",
        color: "#f8fafc",
        textShadow: "0 8px 30px rgba(124,158,255,0.12)",
        fontWeight: 700,
    },
    head: {
        margin: "8px 0 12px",
        fontSize: "22px",
        color: "#dbeafe",
        fontWeight: 600,
    },
    text: {
        margin: 0,
        color: "#b9d1ff",
        opacity: 0.9,
    },
    actions: {
        marginTop: 18,
        display: "flex",
        gap: 12,
        alignItems: "center",
    },
    primary: {
        appearance: "none",
        border: "none",
        padding: "10px 18px",
        borderRadius: 10,
        background: "linear-gradient(90deg,#6d9bff,#5968ff)",
        color: "white",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(59,89,255,0.18)",
    },
    link: {
        color: "#bcd2ff",
        textDecoration: "none",
        padding: "8px",
        borderRadius: 8,
        fontSize: 14,
    },
};

