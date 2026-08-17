import { useEffect, useState } from "react";

const DISMISSED_KEY = "pwa_install_dismissed";
const IOS_DISMISSED_KEY = "pwa_ios_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Detect iOS Safari (not already installed as PWA)
const isIos = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

const isInStandaloneMode = () =>
  ("standalone" in window.navigator && (window.navigator as any).standalone) ||
  window.matchMedia("(display-mode: standalone)").matches;

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroidBanner, setShowAndroidBanner] = useState(false);
  const [showIosBanner, setShowIosBanner] = useState(false);

  useEffect(() => {
    // ── iOS banner ────────────────────────────────────────────
    if (isIos() && !isInStandaloneMode()) {
      const dismissed = localStorage.getItem(IOS_DISMISSED_KEY);
      if (!dismissed) setShowIosBanner(true);
      return;
    }

    // ── Android / Desktop banner ──────────────────────────────
    const wasDismissed = localStorage.getItem(DISMISSED_KEY);
    if (wasDismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowAndroidBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowAndroidBanner(false);
    setDeferredPrompt(null);
  };

  const handleAndroidDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setShowAndroidBanner(false);
  };

  const handleIosDismiss = () => {
    localStorage.setItem(IOS_DISMISSED_KEY, "true");
    setShowIosBanner(false);
  };

  // ── iOS instruction banner ────────────────────────────────────────────────
  if (showIosBanner) {
    return (
      <div style={styles.overlay}>
        <div style={styles.banner}>
          <button style={styles.closeBtn} onClick={handleIosDismiss} aria-label="Close">✕</button>
          <img src="/logo2.png" alt="Annadata Logo" style={styles.logo} />
          <div style={styles.textSection}>
            <p style={styles.title}>Install Annadata App</p>
            <p style={styles.subtitle}>
              Tap&nbsp;
              <span style={styles.shareIcon}>⬆️</span>
              &nbsp;<strong>Share</strong>&nbsp;→&nbsp;
              <strong>"Add to Home Screen"</strong>
            </p>
          </div>
        </div>
        {/* Arrow pointing to Safari share button at bottom */}
        <div style={styles.arrow}>▼</div>
      </div>
    );
  }

  // ── Android / Desktop install banner ─────────────────────────────────────
  if (!showAndroidBanner) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.banner}>
        <button style={styles.closeBtn} onClick={handleAndroidDismiss} aria-label="Close">✕</button>
        <img src="/logo2.png" alt="Annadata Logo" style={styles.logo} />
        <div style={styles.textSection}>
          <p style={styles.title}>Install Annadata App!</p>
          <p style={styles.subtitle}>
            Add to home screen - fast, offline &amp; native app-like experience
          </p>
        </div>
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
    flexDirection: "column",
    alignItems: "center",
    padding: "0 12px 16px",
  },
  arrow: {
    fontSize: "22px",
    color: "#16a34a",
    marginTop: "4px",
    animation: "bounce 1s infinite",
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
    fontSize: "13px",
    color: "#4b5563",
    lineHeight: 1.5,
  },
  shareIcon: {
    fontSize: "16px",
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
