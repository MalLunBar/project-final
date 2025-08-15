import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImagePlus, Trash2, Star, StarOff } from 'lucide-react'

/**
 * Props:
 * - initialFiles?: File[] | string[] (valfritt: redan uppladdade URL:er eller File-objekt)
 * - maxFiles?: number (default 6)
 * - maxSizeMB?: number (default 5)
 * - onFilesChange(files: File[]): void  // lyft upp valda filer till föräldern
 *
 * Note: Vi visar förhandsvisning med URL.createObjectURL för File och med URL direkt för strängar.
 * Cover-bilden är alltid index 0. "Gör omslag" flyttar vald bild till index 0.
 */

const PhotoDropzone = ({
  initialFiles = [],
  maxFiles = 6,
  maxSizeMB = 5,
  onFilesChange,
}) => {

  const [files, setFiles] = useState([])        // File-objekt (nya)
  const [existingUrls, setExistingUrls] = useState([]) // Redan sparade URL:er (edit-läge)

   // Init från props (t.ex. redigera-formulär)
  useEffect(() => {
    const initFiles = []
    const initUrls = []
    for (const f of initialFiles) {
      if (typeof f === 'string') initUrls.push(f)
      else if (f instanceof File) initFiles.push(f)
    }
    setFiles(initFiles)
    setExistingUrls(initUrls)
  }, [initialFiles])

  // Tell parent whenever files change
  useEffect(() => {
    onFilesChange?.(files)
  }, [files, onFilesChange])

  const maxSizeBytes = maxSizeMB * 1024 * 1024
  const accept = useMemo(() => ({
    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
  }), [])

  const onDrop = useCallback((accepted, fileRejections) => {
    // Basic validering info i console (kan byggas ut till UI)
    fileRejections.forEach(r => {
      r.errors.forEach(err => {
        console.warn(`Rejected ${r.file.name}: ${err.code} ${err.message}`)
      })
    })
    if (accepted.length === 0) return

    setFiles(prev => {
      const next = [...prev, ...accepted]
      // Begränsa totalen (inkl existerande URL:er)
      const limit = Math.max(0, maxFiles - existingUrls.length)
      return next.slice(0, limit)
    })
  }, [existingUrls.length, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeBytes,
    multiple: true
  })

  // Städa upp object URLs
  useEffect(() => {
    const localUrls = files.map(f => URL.createObjectURL(f))
    return () => {
      localUrls.forEach(u => URL.revokeObjectURL(u))
    }
  }, [files])

  // Helpers
  const makeCover = (idx, isExisting = false) => {
    if (isExisting) {
      setExistingUrls(prev => {
        const clone = [...prev]
        const [item] = clone.splice(idx, 1)
        clone.unshift(item)
        return clone
      })
    } else {
      setFiles(prev => {
        const clone = [...prev]
        const [item] = clone.splice(idx, 1)
        clone.unshift(item)
        return clone
      })
    }
  }

  const removeFile = (idx, isExisting = false) => {
    if (isExisting) {
      setExistingUrls(prev => prev.filter((_, i) => i !== idx))
    } else {
      setFiles(prev => prev.filter((_, i) => i !== idx))
    }
  }

  // Render
  const hasAny = existingUrls.length + files.length > 0
  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        className={[
          'flex flex-col items-center justify-center gap-3 px-4 py-10 rounded-xl border-2 border-dashed transition',
          isDragActive ? 'border-accent bg-accent/10' : 'border-border bg-muted/30',
          'cursor-pointer'
        ].join(' ')}
      >
        <input {...getInputProps()} />
        <ImagePlus className="w-10 h-10 opacity-70" />
        <div className="text-center">
          <p className="font-medium">Dra & släpp bilder här, eller klicka för att välja</p>
          <p className="text-sm text-muted-foreground">
            Max {maxFiles} bilder • Upp till {maxSizeMB}MB per bild
          </p>
        </div>
      </div>

      {hasAny && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {existingUrls.map((url, idx) => (
            <li key={`existing-${url}-${idx}`} className="relative group">
              <img
                src={url}
                alt={`foto-${idx}`}
                className="w-full h-40 object-cover rounded-xl"
              />
              {/* Badges & actions */}
              <div className="absolute left-2 top-2">
                {idx === 0 ? (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-black/70 text-white">Omslag</span>
                ) : null}
              </div>
              <div className="absolute right-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => makeCover(idx, true)}
                  className="p-2 rounded-full bg-white shadow"
                  title="Gör till omslag"
                >
                  {idx === 0 ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(idx, true)}
                  className="p-2 rounded-full bg-white shadow"
                  title="Ta bort"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}

          {files.map((f, idx) => {
            const url = URL.createObjectURL(f)
            return (
              <li key={`new-${f.name}-${idx}`} className="relative group">
                <img
                  src={url}
                  alt={f.name}
                  className="w-full h-40 object-cover rounded-xl"
                  onLoad={() => URL.revokeObjectURL(url)} // frilägg direkt efter render
                />
                <div className="absolute left-2 top-2">
                  {idx === 0 && existingUrls.length === 0 ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-black/70 text-white">Omslag</span>
                  ) : null}
                </div>
                <div className="absolute right-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => makeCover(idx, false)}
                    className="p-2 rounded-full bg-white shadow"
                    title="Gör till omslag"
                  >
                    {(idx === 0 && existingUrls.length === 0) ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(idx, false)}
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