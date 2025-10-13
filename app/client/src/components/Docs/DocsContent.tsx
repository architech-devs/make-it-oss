import type { TDocSection, DocBlock } from './Content/content'
import CodeBlock from './CodeBlock'
import InteractiveDemo from './InteractiveDemo'
import ArchitectureDiagram from './ArchitectureDiagram'
import { AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'

type Props = { sections: TDocSection[] }

const RenderBlock = ({ block }: { block: DocBlock }) => {
  switch (block.type) {
    case 'heading':
      return <h2 className="text-2xl font-semibold mt-8 mb-3 text-foreground">{block.text}</h2>
    case 'subheading':
      return <h3 className="text-lg font-semibold mt-6 mb-2 text-foreground">{block.text}</h3>
    case 'paragraph':
      return <p className="text-muted-foreground leading-7 mb-3">{block.text}</p>
    case 'code':
      return (
        <CodeBlock 
          code={block.code} 
          language={block.language} 
          title={block.title}
          showLineNumbers={block.language !== 'bash'}
        />
      )
    case 'list':
      return block.ordered ? (
        <ol className="list-decimal ml-6 space-y-2 mb-4 text-muted-foreground">
          {block.items.map((i, idx) => (
            <li key={idx} className="leading-relaxed">{i}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc ml-6 space-y-2 mb-4 text-muted-foreground">
          {block.items.map((i, idx) => (
            <li key={idx} className="leading-relaxed">{i}</li>
          ))}
        </ul>
      )
    case 'link':
      return (
        <a href={block.href} target="_blank" rel="noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">
          {block.text}
        </a>
      )
    case 'table':
      return (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full text-left text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-muted/60">
              <tr>
                {block.headers.map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 align-top text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'demo':
      return (
        <div className="mb-6">
          <InteractiveDemo 
            title={block.title}
            description={block.description}
            demoType={block.demoType}
          />
        </div>
      )
    case 'architecture':
      return (
        <div className="mb-6">
          <ArchitectureDiagram />
        </div>
      )
    case 'callout':
      const getCalloutStyles = (variant: string) => {
        switch (variant) {
          case 'info':
            return {
              container: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100',
              icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            }
          case 'warning':
            return {
              container: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/30 dark:border-yellow-800 dark:text-yellow-100',
              icon: <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            }
          case 'success':
            return {
              container: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-100',
              icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            }
          case 'error':
            return {
              container: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-800 dark:text-red-100',
              icon: <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            }
          default:
            return {
              container: 'bg-muted/50 border-border text-foreground',
              icon: <Info className="h-5 w-5 text-muted-foreground" />
            }
        }
      }
      
      const styles = getCalloutStyles(block.variant)
      return (
        <div className={`border rounded-lg p-4 mb-6 ${styles.container}`}>
          <div className="flex items-start gap-3">
            {styles.icon}
            <div className="flex-1">
              {block.title && (
                <div className="font-semibold mb-2">{block.title}</div>
              )}
              <div className="text-sm leading-relaxed">{block.text}</div>
            </div>
          </div>
        </div>
      )
    case 'feature-grid':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {block.features.map((feature, idx) => {
            const FeatureCard = ({ children }: { children: React.ReactNode }) => {
              if (feature.href) {
                return (
                  <a
                    href={feature.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 border border-border rounded-lg bg-background hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer block group"
                  >
                    {children}
                  </a>
                )
              }
              return (
                <div className="p-6 border border-border rounded-lg bg-background hover:shadow-md transition-shadow">
                  {children}
                </div>
              )
            }

            return (
              <FeatureCard key={idx}>
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </FeatureCard>
            )
          })}
        </div>
      )
    default:
      return null
  }
}

const DocsContent = ({ sections }: Props) => {
  return (
    <div className="pb-16">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h1 className="text-3xl font-bold mb-2 text-foreground">{section.title}</h1>
          {section.blocks.map((b, idx) => (
            <RenderBlock key={section.id + idx} block={b} />
          ))}
        </section>
      ))}
    </div>
  )
}

export default DocsContent