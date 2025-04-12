export function Button({ children, onClick, className = "", size = 'md', variant = 'default' }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white ${className}`}
    >
      {children}
    </button>
  );
}