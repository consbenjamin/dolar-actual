
export default function LoadingSkeleton({ theme }) {
  return (
    <div
      className={`p-6 rounded-lg shadow-md animate-pulse ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className={`h-6 w-24 mb-4 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
      <div className={`h-10 w-32 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
    </div>
  )
}