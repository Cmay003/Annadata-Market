import { useEffect, useState } from "react";

const DISMISSED_KEY = "pwa_install_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem(DISMISSED_KEY);
    if (wasDismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.banner}>
        {/* Close button */}
        <button style={styles.closeBtn} onClick={handleDismiss} aria-label="Close">
          ✕
        </button>

        {/* Icon */}
        <img src="/logo2.png" alt="Annadata Logo" style={styles.logo} />

        {/* Text */}
        <div style={styles.textSection}>
          <p style={styles.title}>Install Annadata App!</p>
          <p style={styles.subtitle}>
            Add to home screen - fast, offline &amp; native app-like experience
          </p>
        </div>

        {/* Install Button */}
        <button style={styles.installBtn} onClick={handleInstall}>
          Install App
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    padding: "0 12px 16px",
  },
  banner: {
    background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
    borderRadius: "16px",
    boxShadow: "0 -4px 30px rgba(0,0,0,0.15)",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    maxWidth: "480px",
    width: "100%",
    border: "1.5px solid #bbf7d0",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#6b7280",
    lineHeight: 1,
    padding: "2px 6px",
    borderRadius: "50%",
  },
  logo: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    objectFit: "cover",
    flexShrink: 0,
  },
  textSection: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontWeight: 700,
    fontSize: "15px",
    color: "#14532d",
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#4b5563",
    lineHeight: 1.4,
  },
  installBtn: {
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(22,163,74,0.4)",
  },
};

export default PWAInstallPrompt;
