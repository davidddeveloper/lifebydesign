"use client"

import React, { useState, useRef, useEffect } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
    Bold,
    Italic,
    Link as LinkIcon,
    List,
    Image as ImageIcon,
    Paperclip,
    X,
    Eye,
    EyeOff,
    Type,
    Heading1,
    Heading2,
    Quote,
    Undo,
    Redo
} from "lucide-react"

interface Attachment {
    name: string
    content: string // Base64
    type: string
    size: number
}

interface EmailEditorProps {
    initialContent?: string
    onChange: (content: string) => void
    onAttachmentsChange: (attachments: Attachment[]) => void
    variables?: { label: string; value: string }[]
}

export function EmailEditor({
    initialContent = "",
    onChange,
    onAttachmentsChange,
    variables = [
        { label: "Name", value: "{{name}}" },
        { label: "Business", value: "{{businessName}}" },
        { label: "Email", value: "{{email}}" }
    ]
}: EmailEditorProps) {
    const [isPreview, setIsPreview] = useState(false)
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#177fc9] underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full rounded-lg my-4',
                },
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    // Update content if initialContent changes and editor is empty
    useEffect(() => {
        if (editor && initialContent && editor.isEmpty) {
            editor.commands.setContent(initialContent)
        }
    }, [initialContent, editor])

    const setLink = () => {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update link
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const handleInsertVariable = (variable: string) => {
        editor?.chain().focus().insertContent(` ${variable} `).run()
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newAttachments: Attachment[] = []

            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i]
                // Limit size to 4MB per file
                if (file.size > 4 * 1024 * 1024) {
                    alert(`File ${file.name} is too large (max 4MB)`)
                    continue
                }

                try {
                    const content = await fileToBase64(file)
                    newAttachments.push({
                        name: file.name,
                        content,
                        type: file.type,
                        size: file.size
                    })
                } catch (err) {
                    console.error("Error reading file:", err)
                }
            }

            const updated = [...attachments, ...newAttachments]
            setAttachments(updated)
            onAttachmentsChange(updated)

            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const removeAttachment = (index: number) => {
        const updated = attachments.filter((_, i) => i !== index)
        setAttachments(updated)
        onAttachmentsChange(updated)
    }

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = error => reject(error)
        })
    }

    if (!editor) {
        return null
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap sticky top-0 z-10">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded text-gray-700 ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded text-gray-700 ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    onClick={setLink}
                    className={`p-1.5 rounded text-gray-700 ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    title="Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded text-gray-700 ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded text-gray-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    title="Heading"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded text-gray-700 ${editor.isActive('blockquote') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium px-1">Variables:</span>
                    {variables.map(v => (
                        <button
                            key={v.value}
                            onClick={() => handleInsertVariable(v.value)}
                            className="px-2 py-1 bg-white border border-gray-200 rounded text-xs hover:border-[#177fc9] hover:text-[#177fc9] transition-colors"
                        >
                            {v.label}
                        </button>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                        disabled={!editor.can().undo()}
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                        disabled={!editor.can().redo()}
                    >
                        <Redo className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1"
                        title="Attach File"
                    >
                        <Paperclip className="w-4 h-4" />
                        <span className="text-xs hidden sm:inline">Attach</span>
                    </button>
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={`p-1.5 rounded flex items-center gap-1 ${isPreview ? "bg-[#177fc9] text-white" : "hover:bg-gray-200 text-gray-700"}`}
                        title="Toggle Preview"
                    >
                        {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="text-xs hidden sm:inline">Preview</span>
                    </button>
                </div>
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
                <div className="px-3 py-2 border-b border-gray-200 bg-gray-50/50 flex flex-wrap gap-2">
                    {attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-2 py-1 text-xs">
                            <span className="max-w-[150px] truncate">{file.name}</span>
                            <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                            <button
                                onClick={() => removeAttachment(i)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Editor Area */}
            <div className="relative min-h-[300px]">
                {isPreview ? (
                    <div
                        className="absolute inset-0 p-4 prose prose-sm max-w-none overflow-y-auto bg-gray-50/50"
                        dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Footer Info */}
            <div className="px-3 py-1 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                <span>{editor.storage.characterCount?.characters()} characters</span>
                <span>Markdown supported</span>
            </div>
        </div>
    )
}
