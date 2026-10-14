'use client'

import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useState } from 'react'
import { MediaPicker, type PickedImage } from './MediaPicker'

type Props = {
  value: string
  onChange: (html: string) => void
}

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={`rte-btn${active ? ' is-active' : ''}`}
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function LinkBar({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const current = (editor.getAttributes('link').href as string | undefined) ?? ''
  const [url, setUrl] = useState(current)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => inputRef.current?.focus(), [])

  const apply = () => {
    const href = url.trim()
    if (!href) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      const normalized = /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : `https://${href}`
      if (editor.state.selection.empty && !editor.isActive('link')) {
        editor.chain().focus().insertContent(`<a href="${normalized.replace(/"/g, '&quot;')}">${normalized}</a>`).run()
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: normalized }).run()
      }
    }
    onClose()
  }

  return (
    <div className="rte-linkbar">
      <label htmlFor="rte-link-url" className="sr-only">
        Link URL
      </label>
      <input
        id="rte-link-url"
        ref={inputRef}
        type="text"
        placeholder="Paste a link: https://…  or  /blog/my-post  or  /go/footography"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            apply()
          }
          if (e.key === 'Escape') onClose()
        }}
      />
      <button type="button" className="adm-btn adm-btn-sm" onClick={apply}>
        Apply
      </button>
      {current && (
        <button
          type="button"
          className="adm-btn adm-btn-sm adm-btn-ghost"
          onClick={() => {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            onClose()
          }}
        >
          Remove link
        </button>
      )}
      <button type="button" className="adm-btn adm-btn-sm adm-btn-ghost" onClick={onClose}>
        Cancel
      </button>
    </div>
  )
}

export function RichTextEditor({ value, onChange }: Props) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual')
  const [html, setHtml] = useState(value)
  const [showLink, setShowLink] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: false }),
      // Non-inclusive: text typed right after a link must not become part of the link
      Link.extend({ inclusive: () => false }).configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        // rel/target are decided on the server when the post is saved
        HTMLAttributes: { rel: null, target: null },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: 'Start writing your article… Use H2/H3 headings to structure it.' }),
    ],
    content: value,
    editorProps: {
      attributes: { class: 'prose rte-content', 'aria-label': 'Post content', role: 'textbox', 'aria-multiline': 'true' },
    },
    onUpdate: ({ editor }) => {
      const next = editor.getHTML()
      setHtml(next)
      onChange(next)
    },
  })

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive('bold'),
            italic: e.isActive('italic'),
            underline: e.isActive('underline'),
            strike: e.isActive('strike'),
            h2: e.isActive('heading', { level: 2 }),
            h3: e.isActive('heading', { level: 3 }),
            h4: e.isActive('heading', { level: 4 }),
            bullet: e.isActive('bulletList'),
            ordered: e.isActive('orderedList'),
            quote: e.isActive('blockquote'),
            code: e.isActive('codeBlock'),
            link: e.isActive('link'),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  })

  const switchMode = (next: 'visual' | 'html') => {
    if (!editor || next === mode) return
    if (next === 'visual') {
      editor.commands.setContent(html, { emitUpdate: false })
      onChange(editor.getHTML())
    } else {
      setHtml(editor.getHTML())
    }
    setShowLink(false)
    setMode(next)
  }

  const insertImage = (img: PickedImage) => {
    // Add an empty paragraph after the image and put the cursor there. Otherwise the image
    // stays selected and the next keystroke or paste would replace it.
    editor
      ?.chain()
      .focus()
      .insertContent([
        { type: 'image', attrs: { src: img.url, alt: img.alt, width: img.width, height: img.height } },
        { type: 'paragraph' },
      ])
      .run()
    setShowPicker(false)
  }

  const s = state
  const disabled = !editor || mode === 'html'

  return (
    <div className="rte">
      <div className="rte-toolbar" role="toolbar" aria-label="Formatting">
        <div className="rte-group">
          <ToolButton label="Heading 2" active={s?.h2} disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolButton>
          <ToolButton label="Heading 3" active={s?.h3} disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolButton>
          <ToolButton label="Heading 4" active={s?.h4} disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}>H4</ToolButton>
        </div>
        <div className="rte-group">
          <ToolButton label="Bold" active={s?.bold} disabled={disabled} onClick={() => editor?.chain().focus().toggleBold().run()}><strong>B</strong></ToolButton>
          <ToolButton label="Italic" active={s?.italic} disabled={disabled} onClick={() => editor?.chain().focus().toggleItalic().run()}><em>I</em></ToolButton>
          <ToolButton label="Underline" active={s?.underline} disabled={disabled} onClick={() => editor?.chain().focus().toggleUnderline().run()}><u>U</u></ToolButton>
          <ToolButton label="Strikethrough" active={s?.strike} disabled={disabled} onClick={() => editor?.chain().focus().toggleStrike().run()}><s>S</s></ToolButton>
        </div>
        <div className="rte-group">
          <ToolButton label="Bullet list" active={s?.bullet} disabled={disabled} onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</ToolButton>
          <ToolButton label="Numbered list" active={s?.ordered} disabled={disabled} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1. List</ToolButton>
          <ToolButton label="Quote" active={s?.quote} disabled={disabled} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>❝</ToolButton>
          <ToolButton label="Code block" active={s?.code} disabled={disabled} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>{'</>'}</ToolButton>
          <ToolButton label="Divider" disabled={disabled} onClick={() => editor?.chain().focus().setHorizontalRule().run()}>―</ToolButton>
        </div>
        <div className="rte-group">
          <ToolButton label="Link" active={s?.link || showLink} disabled={disabled} onClick={() => setShowLink((v) => !v)}>🔗 Link</ToolButton>
          <ToolButton label="Insert image" disabled={disabled} onClick={() => setShowPicker(true)}>🖼 Image</ToolButton>
        </div>
        <div className="rte-group">
          <ToolButton label="Undo" disabled={disabled || !s?.canUndo} onClick={() => editor?.chain().focus().undo().run()}>↶</ToolButton>
          <ToolButton label="Redo" disabled={disabled || !s?.canRedo} onClick={() => editor?.chain().focus().redo().run()}>↷</ToolButton>
        </div>
        <div className="rte-group rte-mode">
          <ToolButton label="Visual editor" active={mode === 'visual'} onClick={() => switchMode('visual')}>Visual</ToolButton>
          <ToolButton label="HTML source" active={mode === 'html'} onClick={() => switchMode('html')}>HTML</ToolButton>
        </div>
      </div>

      {showLink && editor && mode === 'visual' && <LinkBar editor={editor} onClose={() => setShowLink(false)} />}

      <div className={mode === 'visual' ? undefined : 'rte-hidden'}>
        <EditorContent editor={editor} />
      </div>
      {mode === 'html' && (
        <textarea
          className="rte-source"
          aria-label="HTML source"
          value={html}
          spellCheck={false}
          onChange={(e) => {
            setHtml(e.target.value)
            onChange(e.target.value)
          }}
        />
      )}

      {showPicker && <MediaPicker onClose={() => setShowPicker(false)} onSelect={insertImage} askAlt />}
    </div>
  )
}
