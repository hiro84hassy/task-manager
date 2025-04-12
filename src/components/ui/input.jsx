export function Input({ value, onChange, type = 'text', placeholder = '', className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded-md px-3 py-2 w-full ${className}`}
    />
  );
}