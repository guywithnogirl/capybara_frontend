export default function StarRating({ rating, count }) {
  return (
    <div className="stars" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${i <= Math.round(rating) ? 'filled' : 'empty'}`}>★</span>
      ))}
      {count !== undefined && (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '2px' }}>({count})</span>
      )}
    </div>
  );
}
