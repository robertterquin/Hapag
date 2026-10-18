import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useDragControls } from 'motion/react'

interface BottomSheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

// Swiping the handle down this far (or this fast) dismisses the sheet.
const DISMISS_DISTANCE_PX = 120
const DISMISS_VELOCITY = 600

// A native modal <dialog> gives us the focus trap, Esc handling, inert background,
// and focus restoration; motion only handles the slide and the swipe-to-close.
export function BottomSheet({ open, title, onClose, children, footer }: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const dragControls = useDragControls()
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
    }
    if (!open && dialog.open) {
      dialog.close()
      // Safari does not focus buttons on click, so the browser's own restore can land on <body>.
      const target = returnFocusRef.current
      if (target?.isConnected && target !== document.body) target.focus()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="bottom-sheet"
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      {open ? (
        <motion.div
          className="bottom-sheet-panel"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          drag="y"
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.7 }}
          onDragEnd={(_, info) => { if (info.offset.y > DISMISS_DISTANCE_PX || info.velocity.y > DISMISS_VELOCITY) onClose() }}
        >
          <div className="bottom-sheet-handle" onPointerDown={(event) => dragControls.start(event)} aria-hidden="true">
            <span />
          </div>
          <header className="bottom-sheet-header">
            <h2 id={titleId}>{title}</h2>
            <button className="bottom-sheet-close" type="button" onClick={onClose} aria-label="Close">×</button>
          </header>
          <div className="bottom-sheet-body">{children}</div>
          {footer ? <footer className="bottom-sheet-footer">{footer}</footer> : null}
        </motion.div>
      ) : null}
    </dialog>
  )
}
