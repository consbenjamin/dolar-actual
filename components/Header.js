import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

export default function Header({ theme, toggleTheme }) {
  return (
    <header className={`py-4 px-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image 
            src="/favicon.svg" 
            alt="Ícono Dólar" 
            width={24} 
            height={24}
          />
          <h1 className="text-2xl font-bold">Dólar Argentina</h1>
        </div>
        
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  )
}