import ThemeToggle from "./ThemeToggle";

export default function Header({ theme, toggleTheme }) {
  return (
    <header className={`py-4 px-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dólar Argentina</h1>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  )
}