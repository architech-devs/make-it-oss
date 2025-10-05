import type { TDocSection, DocBlock } from './Content/content'

type Props = { sections: TDocSection[] }

const RenderBlock = ({ block }: { block: DocBlock }) => {
  switch (block.type) {
    case 'heading':
      return <h2 className="text-2xl font-semibold mt-8 mb-3">{block.text}</h2>
    case 'subheading':
      return <h3 className="text-lg font-semibold mt-6 mb-2">{block.text}</h3>
    case 'paragraph':
      return <p className="text-muted-foreground leading-7 mb-3">{block.text}</p>
    case 'code':
      return (
        <pre className="mb-4 rounded-lg bg-muted p-4 overflow-x-auto text-sm"><code>{block.code}</code></pre>
      )
    case 'list':
      return block.ordered ? (
        <ol className="list-decimal ml-6 space-y-1 mb-4">
          {block.items.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc ml-6 space-y-1 mb-4">
          {block.items.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      )
    case 'link':
      return (
        <a href={block.href} target="_blank" rel="noreferrer" className="text-primary underline">
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
                  <th key={h} className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
          <h1 className="text-3xl font-bold mb-2">{section.title}</h1>
          {section.blocks.map((b, idx) => (
            <RenderBlock key={section.id + idx} block={b} />
          ))}
        </section>
      ))}
    </div>
  )
}

export default DocsContent