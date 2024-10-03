import { useEffect } from "react";

// The event execution order is: mousedown -> mouseup -> click.
// Choose the event type based on the desired behavior:
//
// click:
//  -This is useful in cases like the sidebar, where using "click" ensures that navigation can occur before the sidebar closes.
//  - For cases like the modal, because the timing issue, using "click" might cause the modal to close immediately after it is opened.

type EventType = "mousedown" | "mouseup" | "click";

export default function useCloseAndEscape(
  ref: React.RefObject<HTMLElement>,
  onClose: () => void,
  isOpen: boolean,
  returnFocusOnClose: boolean = true,
  eventType: EventType = "mousedown",
) {
  // const triggerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // TODO: Consider if I need to add toastify to the white list. Right now, if I click on the toast, the modal will close.
      const headlessUiPortal = document.getElementById(
        "headlessui-portal-root",
      );

      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        // a check to ensure that the click was not triggered from the headless ui portal
        !(headlessUiPortal && headlessUiPortal.contains(event.target as Node))
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener(eventType, handleClickOutside);
      window.addEventListener("keydown", handleEscape);
      return () => {
        window.removeEventListener(eventType, handleClickOutside);
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [ref, onClose, isOpen, returnFocusOnClose]);
}
