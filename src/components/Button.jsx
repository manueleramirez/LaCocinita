
export default function Button({ label,icon,onClick }) {
  return (
    <>
      {/*<!-- Component: Small primary basic button --> */}
      <button onClick={onClick} className="inline-flex items-center justify-center h-8 gap-2 px-4 text-xs font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-purple-800 hover:bg-purple-600 focus:bg-purple-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-purple-300 disabled:bg-purple-300 disabled:shadow-none">
       {icon}<span>{label}</span>
      </button>
      {/*<!-- End Small primary basic button --> */}
    </>
  )
}
