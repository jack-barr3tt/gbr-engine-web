import { Card, Spinner, TextInput } from "flowbite-react"
import { useMemo, useState, useRef, useEffect } from "react"
import type { Dispatch, SetStateAction } from "react"
import { useFloating, autoUpdate, offset, flip, shift, size } from "@floating-ui/react"

type SearchSelectProps = {
  id?: string
  value: string
  placeholder?: string
  onValueChange: Dispatch<SetStateAction<string>>
  onBlur?: () => void
  getValueText?: (value: string) => string
  options: { value: string; label: string }[]
  color?: "info" | "success" | "failure"
  loading?: boolean
}

export default function SearchSelect(props: SearchSelectProps) {
  const {
    id,
    options,
    value: selected,
    placeholder,
    onValueChange,
    onBlur,
    getValueText,
    color,
    loading,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const optionRef = useRef<HTMLButtonElement | null>(null)

  const chosenOption = useMemo(() => options.find((o) => o.value === selected), [options, selected])

  // When dropdown opens, set highlighted index to current selection or 0 (or -1 if no options)
  useEffect(() => {
    if (isOpen) {
      if (options.length === 0) {
        setHighlightedIndex(-1)
      } else {
        const idx = options.findIndex((o) => o.value === selected)
        setHighlightedIndex(idx >= 0 ? idx : 0)
      }
    } else {
      setHighlightedIndex(-1)
    }
  }, [isOpen])

  // When the user types (selected changes) while open, sync highlighted index to first/current match.
  // We depend only on selected, not options, so keyboard navigation (arrow keys) doesn't get reset
  // when the parent re-renders and passes a new options array reference.
  useEffect(() => {
    if (!isOpen) return
    if (options.length === 0) {
      setHighlightedIndex(-1)
      return
    }
    const idx = options.findIndex((o) => o.value === selected)
    setHighlightedIndex(idx >= 0 ? idx : 0)
  }, [isOpen, selected])

  // Scroll highlighted option into view
  useEffect(() => {
    optionRef.current?.scrollIntoView({ block: "nearest" })
  }, [highlightedIndex])

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(5),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          })
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return
    const canNavigate = !loading && options.length > 0
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (canNavigate) {
          setHighlightedIndex((i) => Math.min(i + 1, options.length - 1))
        }
        break
      case "ArrowUp":
        e.preventDefault()
        if (canNavigate) {
          setHighlightedIndex((i) => Math.max(i - 1, 0))
        }
        break
      case "Enter":
        e.preventDefault()
        if (canNavigate && highlightedIndex >= 0 && options[highlightedIndex]) {
          onValueChange(options[highlightedIndex].value)
          setIsOpen(false)
          inputRef.current?.focus()
        }
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        inputRef.current?.focus()
        break
    }
  }

  return (
    <div>
      <div ref={refs.setReference}>
        <TextInput
          id={id}
          ref={inputRef}
          value={(getValueText ? getValueText(selected) : selected) || chosenOption?.label || ""}
          onChange={(e) => {
            onValueChange(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={(e) => {
            setTimeout(() => {
              setIsOpen(false)
              onBlur?.()
            }, 150)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Search..."}
          color={color}
        />
      </div>
      {isOpen &&
        (loading === true || (loading === false && options.length === 0) || options.length > 0) && (
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 50,
            }}
          >
            <Card className="overflow-hidden" theme={{ root: { children: "p-0" } }}>
              <div className="overflow-y-auto max-h-60">
                {loading === true ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-3 text-gray-500">
                    <Spinner size="sm" />
                    <span>Loading options...</span>
                  </div>
                ) : loading === false && options.length === 0 ? (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                    No options
                  </div>
                ) : (
                  options.map(({ value, label }, index) => (
                    <button
                      key={value}
                      ref={index === highlightedIndex ? optionRef : undefined}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                        index === highlightedIndex ? "bg-gray-100" : ""
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault()
                      }}
                      onClick={() => {
                        onValueChange(value)
                        setIsOpen(false)
                        inputRef.current?.focus()
                      }}
                    >
                      {label}
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}
    </div>
  )
}
