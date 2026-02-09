
export default function Footer({ theme }) {
  return (
    <footer
      className={`py-6 border-t ${theme === "dark" ? "bg-[hsl(var(--card))] border-gray-700" : "bg-[hsl(var(--card))] border-gray-200"}`}
    >
      <div className="container mx-auto max-w-7xl px-4 text-center">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
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