import type { TDocSection } from './Content/content'

type Props = {
  sections: TDocSection[]
  activeId?: string
  onNavigate?: (id: string) => void
}

const DocsSidebar = ({ sections, activeId, onNavigate }: Props) => {
  return (
    <nav className="space-y-2">
      {sections.map((s) => {
        const isActive = s.id === activeId
        return (
          <button
            key={s.id}
            onClick={() => onNavigate?.(s.id)}
            className={
              'w-full text-left px-3 py-2 rounded-md transition-colors ' +
              (isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted text-foreground')
            }
          >
            <div className="text-base">{s.title}</div>
          </button>
        )
      })}
    </nav>
  )
}

export default DocsSidebar