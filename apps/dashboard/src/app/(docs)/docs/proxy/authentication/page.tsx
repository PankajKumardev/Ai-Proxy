export default function AuthPage() {
  return (
    <div>
      <h1 style={{ fontSize: "36px", fontWeight: 800, color: "white", marginBottom: "16px" }}>Authentication</h1>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px" }}>API Gateway authentication works via standard bearer tokens. Pass your AI Gateway API key in the Authorization header: <code>Bearer sk-gw-...</code></p>
    </div>
  )
}
