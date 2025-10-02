export default function ComplaintCard({ c, onUpdate }) {
  return (
    <div style={{ border:'1px solid #ddd', padding:12, borderRadius:8, marginBottom:10 }}>
      <h4>{c.title}</h4>
      <p>{c.description}</p>
      <p><strong>Status:</strong> {c.status}</p>
      <p><strong>Reporter:</strong> {c.reporter?.name || c.reporter?.email}</p>
      {c.images && c.images[0] && <img src={`http://localhost:5001/${c.images[0]}`} alt="" style={{ width:120 }} />}
      {onUpdate && <div style={{ marginTop:8 }}>
        <button onClick={() => onUpdate('IN_PROGRESS')}>Mark In Progress</button>
        <button onClick={() => onUpdate('RESOLVED')}>Resolve</button>
      </div>}
    </div>
  );
}
