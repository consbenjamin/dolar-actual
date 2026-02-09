import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

export default function Header({ theme, toggleTheme }) {
  return (
    <header className={`py-4 px-6 border-b ${theme === "dark" ? "bg-[hsl(var(--card))] border-gray-700" : "bg-[hsl(var(--card))] border-gray-200"}`}>
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image src="/favicon.svg" alt="Ícono Dólar" width={28} height={28} />
          <h1 className="text-2xl font-bold tracking-tight">Dólar Argentina</h1>
        </div>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  )
}