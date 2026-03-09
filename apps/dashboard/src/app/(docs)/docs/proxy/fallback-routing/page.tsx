export default function FallbackPage() {
  return (
    <div>
      <h1 style={{ fontSize: "36px", fontWeight: 800, color: "white", marginBottom: "16px" }}>Fallback Routing</h1>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px" }}>AI Gateway will automatically try alternative providers if your chosen model fails, providing 99.99% reliability.</p>
    </div>
  )
}
