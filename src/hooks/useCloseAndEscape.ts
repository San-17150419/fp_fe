import { useEffect } from "react";

/**
 * A custom hook that adds event listeners to the window for both click and escape key presses.
 * If the click event occurs outside of the element referenced by `ref`, or if the escape key is pressed,
 * the `onClose` function is called. Focus is also managed to ensure the trigger element is focused when closing.
 *
 * @param {React.RefObject<HTMLElement>} ref - A reference to the element that should be considered the boundary for the click event.
 * @param {() => void} onClose - A function that should be called when a click event occurs outside of the element referenced by `ref`, or when the escape key is pressed.
 * @param {boolean} isOpen - A boolean that indicates if the element is open and should be focusable.
 * @return {void} This function does not return anything.
 */
export default function useCloseAndEscape(
  ref: React.RefObject<HTMLElement>,
  onClose: () => void,
  isOpen: boolean,
  returnFocusOnClose: boolean = true,
) {
  // const triggerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // This is for preventing element other than the trigger element from being focused when closing
        // Without this, the focus would be lost when clicking outside of the element
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };


    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [ref, onClose, isOpen, returnFocusOnClose]);
}
