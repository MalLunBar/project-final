import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImagePlus, Trash2, Star, StarOff } from 'lucide-react'

/**
 * initialFiles: (File[] | string[])  // blandning går bra
 * onChange?: ({ items, removedExistingUrls }) => void
 *   - items: Array<{ kind: 'existing' | 'new', url?: string, file?: File }>
 *   - removedExistingUrls: string[]
 */


// helpers/cloudinary.js (eller högst upp i PhotoDropzone.jsx)
const extractPublicId = (url) => {
  try {
    const u = new URL(url)
    // Ex: /image/upload/c_fill,w_300/v16912345/folder/name_abc.jpg
    const path = u.pathname
    const i = path.indexOf('/upload/')
    if (i === -1) return null
    let rest = path.slice(i + '/upload/'.length) // c_fill.../v169.../folder/name.jpg
    const vMatch = rest.match(/\/v\d+\//)        // hoppa förbi transformationer till version
    if (vMatch) rest = rest.slice(vMatch.index + vMatch[0].length) // folder/name.jpg
    return rest.replace(/\.[a-z0-9]+$/i, '')     // ta bort .jpg/.png
  } catch { return null }
}

const PhotoDropzone = ({
  initialFiles = [],
  maxFiles = 6,
  maxSizeMB = 5,
  onChange,
  inputId = 'file-input',
  ariaLabelledBy,
  ariaLabel, // fallback om ingen labelledBy finns

}) => {

  const [items, setItems] = useState([]) // [{kind:'existing'|'new', url?, file?}]
  const [removedExistingPublicIds, setRemovedExistingPublicIds] = useState([])

  // initiera från props

  useEffect(() => {
    const init = []
    for (const f of initialFiles) {
      if (typeof f === 'string') {
        init.push({ kind: 'existing', url: f, publicId: extractPublicId(f) })
      } else if (f && typeof f === 'object') {
        // Tillåt { url, publicId } från backend
        if ('url' in f || 'publicId' in f) {
          init.push({ kind: 'existing', url: f.url, publicId: f.publicId ?? extractPublicId(f.url) })
        } else if (f instanceof File) {
          init.push({ kind: 'new', file: f })
        }
      }
    }
    setItems(init)
    setRemovedExistingPublicIds([])
  }, [initialFiles])

  // rapportera uppåt
  useEffect(() => {
    onChange?.({ items, removedExistingPublicIds })
  }, [items, removedExistingPublicIds, onChange])

  const maxSizeBytes = maxSizeMB * 1024 * 1024
  const accept = useMemo(() => ({
    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
  }), [])



  const onDrop = useCallback((accepted, rejects) => {
    rejects.forEach(r => r.errors.forEach(err => {
      console.warn(`Rejected ${r.file.name}: ${err.code} ${err.message}`)
    }))
    if (accepted.length === 0) return

    setItems(prev => {
      const remainingSlots = Math.max(0, maxFiles - prev.length)
      const nextNew = accepted.slice(0, remainingSlots).map(f => ({ kind: 'new', file: f }))
      return [...prev, ...nextNew]
    })
  }, [maxFiles])


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeBytes,
    multiple: true
  })


  const rootProps = getRootProps({
    role: 'button',
    ...(ariaLabelledBy
      ? { 'aria-labelledby': ariaLabelledBy }
      : { 'aria-label': ariaLabel || 'Ladda upp bilder' }),

  })

  const inputProps = getInputProps({
    id: inputId,
    ...(ariaLabelledBy
      ? { 'aria-labelledby': ariaLabelledBy }
      : { 'aria-label': ariaLabel || 'Ladda upp bilder' }),

  })


  // helpers
  const makeCover = (idx) => {
    setItems(prev => {
      if (idx <= 0 || idx >= prev.length) return prev
      const copy = [...prev]
      const [moved] = copy.splice(idx, 1)
      copy.unshift(moved)
      return copy
    })
  }


  const removeAt = (idx) => {
    setItems(prev => {
      const copy = [...prev]
      const [removed] = copy.splice(idx, 1)
      if (removed?.kind === 'existing' && removed.publicId) {
        setRemovedExistingPublicIds(prevIds => [...prevIds, removed.publicId])
      }
      return copy
    })
  }

  // Render
  const hasAny = items.length > 0

  return (
    <div className="flex flex-col gap-3">
      <div
        {...rootProps}
        className={[
          'flex flex-col items-center justify-center gap-3 px-4 py-10 rounded-xl border-2 border-dashed transition',
          isDragActive ? 'border-accent bg-accent/10' : 'border-border bg-muted/30',
          'cursor-pointer'
        ].join(' ')}
      >
        <input {...inputProps} className="sr-only" />
        <ImagePlus className="w-10 h-10 opacity-70" aria-hidden="true" />
        <div className="text-center" aria-hidden="true">
          <p className="font-medium">Dra & släpp bilder här, eller klicka för att välja</p>
          <p className="text-sm text-muted-foreground">
            Max {maxFiles} bilder • Upp till {maxSizeMB}MB per bild
          </p>
        </div>
      </div>

      {hasAny && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((it, idx) => {
            const isCover = idx === 0
            // skapa lokal preview-url för nya filer
            const preview = it.kind === 'new' ? URL.createObjectURL(it.file) : it.url
            return (
              <li key={`${it.kind}-${it.url || it.file?.name}-${idx}`} className="relative group">
                <img
                  src={preview}
                  alt={`foto-${idx}`}
                  className="w-full h-40 object-cover rounded-xl"
                  onLoad={() => { if (it.kind === 'new') URL.revokeObjectURL(preview) }}
                />
                {/* badge */}
                <div className="absolute left-2 top-2">
                  {isCover && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-black/70 text-white">
                      Omslag
                    </span>
                  )}
                </div>
                {/* actions - alltid synliga */}
                <div className="absolute right-2 bottom-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => makeCover(idx)}
                    className="p-2 rounded-full bg-white shadow"
                    title="Gör till omslag"
                  >
                    {isCover ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="p-2 rounded-full bg-white shadow"
                    title="Ta bort"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default PhotoDropzone