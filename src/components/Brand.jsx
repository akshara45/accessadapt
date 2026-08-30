export function Brand({ compact = false }) {
  return (
    <div className="brand">
      <div className="brand-mark" aria-hidden="true">A</div>
      <div>
        <strong>AccessAdapt</strong>
        {!compact && <span>Personalized web accessibility</span>}
      </div>
    </div>
  );
}
