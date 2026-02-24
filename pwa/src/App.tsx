import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Note = {
  id: string
  text: string
  createdAt: number
}

const STORAGE_KEY = 'pwa-notes'

function loadNotes(): Note[] {
  try {
    const rawNotes = localStorage.getItem(STORAGE_KEY)
    if (!rawNotes) {
      return []
    }

    const parsedNotes = JSON.parse(rawNotes) as Note[]
    return Array.isArray(parsedNotes) ? parsedNotes : []
  } catch {
    return []
  }
}

function App() {
  const [notes, setNotes] = useState<Note[]>(loadNotes)
  const [draft, setDraft] = useState('')

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => b.createdAt - a.createdAt),
    [notes],
  )

  const saveNotes = (nextNotes: Note[]) => {
    setNotes(nextNotes)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextNotes))
  }

  const addNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanDraft = draft.trim()
    if (!cleanDraft) {
      return
    }

    const note: Note = {
      id: crypto.randomUUID(),
      text: cleanDraft,
      createdAt: Date.now(),
    }

    saveNotes([note, ...notes])
    setDraft('')
  }

  const deleteNote = (id: string) => {
    const nextNotes = notes.filter((note) => note.id !== id)
    saveNotes(nextNotes)
  }

  return (
    <main className="container">
      <h1>PWA Notes</h1>
      <p className="subtitle">Notas guardadas localmente y disponibles offline.</p>

      <form onSubmit={addNote} className="note-form">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escribe una nota..."
          aria-label="Nueva nota"
          maxLength={240}
        />
        <button type="submit">Agregar</button>
      </form>

      {sortedNotes.length === 0 ? (
        <p className="empty">No hay notas todavía.</p>
      ) : (
        <ul className="notes-list">
          {sortedNotes.map((note) => (
            <li key={note.id} className="note-item">
              <p>{note.text}</p>
              <button type="button" onClick={() => deleteNote(note.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
