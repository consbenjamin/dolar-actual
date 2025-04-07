"use client"

import { useEffect, useRef, useState } from "react";

export default function DollarTicker({ dollarRates, theme }) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const [content, setContent] = useState([])

  useEffect(() => {
    if (dollarRates.length > 0) {
      setContent([...dollarRates, ...dollarRates]) // duplicado para scroll infinito
    }
  }, [dollarRates])

  useEffect(() => {
    let scrollX = 0
    let animationId

    const scroll = () => {
      if (!containerRef.current || !contentRef.current) return

      scrollX += 0.5 // velocidad del scroll

      if (scrollX >= contentRef.current.scrollWidth / 2) {
        scrollX = 0 // reset al llegar al final
      }

      containerRef.current.scrollLeft = scrollX
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationId)
  }, [content])

  return (
    <div
      className={`relative overflow-hidden py-3 border-y ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
    >
      <div
        className="whitespace-nowrap flex"
        ref={containerRef}
        style={{ overflowX: 'hidden' }}
      >
        <div className="flex" ref={contentRef}>
          {content.map((rate, index) => (
            <div
              key={`${rate.casa}-${index}`}
              className="flex items-center mx-6 px-2"
            >
              <span className={`font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                {rate.nombre}:
              </span>
              <span className="mx-2">
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  ${parseFloat(rate.venta).toFixed(2)}
                </span>
                {rate.compra !== "No Cotiza" && (
                  <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    (Compra: ${parseFloat(rate.compra).toFixed(2)})
                  </span>
                )}
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {new Date(rate.fechaActualizacion).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Efecto fade en los bordes */}
      <div
        className={`absolute top-0 left-0 h-full w-12 pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-r from-gray-800' : 'bg-gradient-to-r from-gray-50'}`}
      ></div>
      <div
        className={`absolute top-0 right-0 h-full w-12 pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-l from-gray-800' : 'bg-gradient-to-l from-gray-50'}`}
      ></div>
    </div>
  )
}
