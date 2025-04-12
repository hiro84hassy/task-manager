export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => onOpenChange(false)}>
      <div className="bg-white rounded-lg p-4 min-w-[300px]" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
export function DialogContent({ children }) {
  return <div>{children}</div>;
}
export function DialogHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}
export function DialogTitle({ children }) {
  return <h2 className="text-lg font-bold">{children}</h2>;
}