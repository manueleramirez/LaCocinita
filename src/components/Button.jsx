export default function Button({ label, icon, onClick, variant = "primary", size = "md" }) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition duration-300 rounded whitespace-nowrap focus-visible:outline-none disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  };
  
  const variantClasses = {
    primary: "text-white bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 disabled:bg-purple-300",
    secondary: "text-purple-600 bg-purple-100 hover:bg-purple-200 focus:bg-purple-200 disabled:bg-purple-50",
    danger: "text-white bg-red-500 hover:bg-red-600 focus:bg-red-600 disabled:bg-red-300",
    success: "text-white bg-green-500 hover:bg-green-600 focus:bg-green-600 disabled:bg-green-300"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
