"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  // First effect: extract headings when pathname changes
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".prose h2, .prose h3")) as HTMLHeadingElement[]
    
    const newHeadings = elements.map((elem) => {
      if (!elem.id) {
        elem.id = elem.innerText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      }
      return {
        id: elem.id,
        text: elem.innerText,
        level: Number(elem.tagName.charAt(1)), // 2 or 3
      }
    })
    
    setHeadings(newHeadings)
  }, [pathname])

  // Second effect: track scrolling
  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const headingElements = Array.from(document.querySelectorAll(".prose h2, .prose h3"))
      
      let currentActiveId = ""
      
      // Look for the heading closest to the top but ABOVE our 120px threshold
      for (const heading of headingElements) {
        const rect = heading.getBoundingClientRect()
        // 120px offset accounts for the sticky navbar and some padding
        if (rect.top <= 120) {
          currentActiveId = heading.id
        } else {
          // Since headings are in order, the first one that is > 120px means we're done
          break
        }
      }
      
      // If we are at the very top (no headings have scrolled past the threshold)
      if (!currentActiveId && headingElements.length > 0) {
        currentActiveId = headingElements[0].id
      }
      
      // If scrolled all the way to the absolute bottom of the page, 
      // highlight the last section even if it didn't hit the 120px top boundary.
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        currentActiveId = headingElements[headingElements.length - 1].id
      }

      setActiveId(currentActiveId)
    }

    // Call once to set initial state
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      // Offset for the sticky header (14 spacing * 4 = 56px) + extra padding
      const top = element.getBoundingClientRect().top + window.scrollY - 80 
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <aside className="w-[200px] shrink-0 py-10 px-4 hidden xl:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto hidden-scrollbar">
      <div className="text-[12px] font-semibold text-white mb-4">On this page</div>
      <div className="flex flex-col gap-3 text-[13px] text-[#888888] border-l border-white/10 pl-4">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={cn(
                "cursor-pointer transition-colors relative block truncate",
                isActive ? "text-[#d4d4d4]" : "hover:text-white",
                heading.level === 3 && "pl-3 text-[12px]",
                isActive && "before:absolute before:-left-[17px] before:top-1 before:bottom-1 before:w-[2px] before:bg-white"
              )}
            >
              {heading.text}
            </a>
          )
        })}
      </div>
    </aside>
  )
}
