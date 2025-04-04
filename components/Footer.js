
export default function Footer({ theme }) {
  return (
    <footer
      className={`py-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Datos proporcionados por{" "}
          <a href="https://dolarapi.com/" target="_blank" rel="noopener noreferrer" className="underline">
            DolarAPI
          </a>{" "}
          y{" "}
          <a href="https://argentinadatos.com/" target="_blank" rel="noopener noreferrer" className="underline">
            ArgentinaDatos
          </a>
        </p>
      </div>
    </footer>
  )
}