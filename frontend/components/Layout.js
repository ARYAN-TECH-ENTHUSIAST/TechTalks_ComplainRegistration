export default function Layout({ children }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: 20 }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
        <h2>Complaint Portal</h2>
        <nav>
          <a href="/">Home</a> {" | "}
          <a href="/submit">Submit</a> {" | "}
          <a href="/dashboard">My Dashboard</a> {" | "}
          <a href="/heatmap">Heatmap</a> {" | "}
          <a href="/admin">Admin</a> {" | "}
          <a href="/login">Login</a> {" | "}
          <a href="/register">Register</a>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

