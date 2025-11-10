import { Card, Spinner, TextInput } from "flowbite-react"
import { useMemo, useState, useRef } from "react"
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
  const inputRef = useRef<HTMLInputElement>(null)

  const chosenOption = useMemo(() => options.find((o) => o.value === selected), [options, selected])

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

  return (
    <div>
      <div ref={refs.setReference}>
        <TextInput
          id={id}
          ref={inputRef}
          value={(getValueText ? getValueText(selected) : selected) || chosenOption?.label || ""}
          onChange={(e) => {
            onValueChange(e.target.value)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={(e) => {
            setTimeout(() => {
              setIsOpen(false)
              onBlur?.()
            }, 150)
          }}
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
                  options.map(({ value, label }) => (
                    <button
                      key={value}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
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
