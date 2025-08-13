import { useEffect, useRef, useState } from "react"

export default function AutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder = "Sök stad/ort…",
  minChars = 2,
  debounceMs = 200,
  maxVisible = 10,
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [active, setActive] = useState(-1)
  const listRef = useRef(null)
  const debounceRef = useRef(null)
  const controller = useRef(null)

  const hasQuery = value.trim().length >= minChars
  const url = `http://localhost:8080/api/geocode?q=${encodeURIComponent(value.trim())}&limit=${maxVisible}&language=sv`

  // Hämta förslag (async) från din backend
  useEffect(() => {
    console.log("[C2] AFTER state → items:", items, "open:", open);
    if (!hasQuery) {
      setItems([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      controller.current?.abort(); // 🛑 avbryt tidigare fetch
      controller.current = new AbortController();

      setLoading(true);
      try {
        console.log("[A] fetch url:", url, "value:", value);

        const res = await fetch(
          url, { signal: controller.current.signal }

        )

        const data = await res.json()

        // Mappa backendens { name, lat, lon } -> { id, label, center }
        const mapped = (Array.isArray(data) ? data : []).map((d) => ({
          id: `${d.lat},${d.lon}`,       // eller d.place_id om du skickar det
          label: d.name.split(),                 // <- label finns nu
          center: [Number(d.lat), Number(d.lon)],
        }))

        console.log("[B] mapped length:", mapped.length, mapped.map(x => x.label));

        setItems(mapped)
        setActive(-1);                 // <-- lägg till denna
        setOpen(mapped.length > 0)

        console.log("[C] render items length:", items.length, "open:", open, "hasQuery:", hasQuery);

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err)
          setItems([])
          setOpen(false)
        }
      } finally {
        setLoading(false)
      }
    }, debounceMs)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      controller.current?.abort(); // 🛑 avbryt vid unmount
    };
  }, [value, hasQuery, debounceMs, maxVisible]);



  const handleSelect = (idx) => {
    const it = items[idx]
    if (!it) return
    onSelect(it)
    setOpen(false)
  }
  // Hantera tangentbordshändelser
  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min((active < 0 ? 0 : active + 1), items.length - 1);
      setActive(next);
      listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max((active < 0 ? 0 : active - 1), 0);
      setActive(prev);
      listRef.current?.children[prev]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (active >= 0) {
        e.preventDefault();
        handleSelect(active);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };


  console.log("Render items:", items, "open:", open);
  return (
    <div className="relative z-[10000]">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(hasQuery && items.length > 0)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full rounded-2xl border px-3 py-2 outline-none"
        role="combobox"
        aria-expanded={open}
        aria-controls="autocomplete-listbox"
        aria-autocomplete="list"
      />
      {loading && (
        <div className="absolute right-3 top-2.5 text-sm opacity-70">
          Söker…
        </div>
      )}
      {open && (
        <ul
          id="autocomplete-listbox"
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-2xl border bg-white shadow"
        >
          {items.map((opt, i) => {
            const isActive = i === active;
            const q = value.trim();

            // Säker label: använd opt.label, annars opt.name, annars tom sträng
            const label = String(opt.label ?? opt.name ?? "");
            const starts = label.toLowerCase().startsWith(q.toLowerCase());

            return (
              <li
                key={opt.id ?? `${opt.lat},${opt.lon},${i}`}
                role="option"
                aria-selected={isActive}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(i)}
                className={`cursor-pointer px-3 py-2 ${isActive ? "bg-gray-100" : ""}`}
              >
                {starts ? (
                  <>
                    <strong>{label.slice(0, q.length)}</strong>
                    {label.slice(q.length)}
                  </>
                ) : (
                  label
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  )
}
