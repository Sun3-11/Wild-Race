export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}) {
  const base =
    "px-4 py-2 rounded-2xl font-semibold cursor-pointer transition-transform active:scale-95 select-none";
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : variant === "ghost"
      ? "bg-transparent text-white border border-white/40 hover:bg-white/10"
      : "bg-slate-700 text-white";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
