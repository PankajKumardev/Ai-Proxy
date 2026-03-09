export default function CachingPage() {
  return (
    <div>
      <h1 style={{ fontSize: "36px", fontWeight: 800, color: "white", marginBottom: "16px" }}>Caching</h1>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px" }}>Responses are cached automatically using SHA-256 signatures of identical requests. Cache TTLs vary by plan level.</p>
    </div>
  )
}
