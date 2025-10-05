import { useEffect, useMemo, useRef, useState } from 'react'
import DocsSidebar from './DocsSidebar'
import DocsContent from './DocsContent'
import { docsSections } from './Content/content'

const DocsMain = () => {
  const sections = useMemo(() => docsSections, [])
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1))
        if (visible[0]) {
          const id = visible[0].target.getAttribute('id')
          if (id) setActiveId(id)
        }
      },
      { root: null, rootMargin: '0px 0px -70% 0px', threshold: [0, 1] }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  return (
    <div ref={containerRef} className="w-full grid grid-cols-12 gap-6 md:px-0 px-4">
      <aside className="col-span-12 md:col-span-4 lg:col-span-3 md:sticky md:top-16 self-start">
        <DocsSidebar
          sections={sections}
          activeId={activeId}
          onNavigate={(id) => {
            const el = document.getElementById(id)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        />
      </aside>
      <div className="hidden md:block md:col-span-1 lg:col-span-1">
        <div className="h-full w-px bg-muted-foreground/20 mx-auto" />
      </div>
      <main className="col-span-12 md:col-span-7 lg:col-span-8">
        <DocsContent sections={sections} />
      </main>
    </div>
  )
}

export default DocsMain