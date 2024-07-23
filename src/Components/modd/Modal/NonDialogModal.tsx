import React, { useRef, useEffect } from "react";
import useCloseAndEscape from "../../../hooks/useCloseAndEscape";
import { AnimatePresence, motion } from "framer-motion";

type ModalProps = {
  children?: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
  enter?: "leftTop" | "leftMiddle";
};

const animationVariants = {
  leftTop: {
    initial: {
      x: "-100vw",
      y: "-100vh",
      width: "100vw",
      height: "100vh",
      scale: 0.2,
    },
    animate: { x: "-50%", y: "-50%", scale: 1 },
    exit: { x: "-100vw", y: "-100vh", scale: 0.2 },
    transition: { ease: "easeOut", duration: 0.8 },
  },
  leftMiddle: {
    initial: {
      x: "-100vw",
      y: "-50%",
      width: "100vw",
      height: "100vh",
      scale: 0.2,
    },
    animate: { x: "-50%", y: "-50%", scale: 1 },
    exit: { x: "-100vw", y: "-50%", scale: 0.2 },
    transition: { ease: "easeOut", duration: 0.8 },
  },
};

export default function Modal({
  children,
  onClose,
  enter = "leftTop",
  isOpen,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useCloseAndEscape(modalRef, onClose, isOpen);

  const currentVariant = animationVariants[enter];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 top-0 z-50 flex bg-black/50"
          initial={{ opacity: 0 }}
          // The overlay is not reachable by pressing tab
          // tabIndex={-1}
          aria-hidden="true"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeOut", duration: 0.8 }}
          onClick={() => {
            if (modalRef.current) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={currentVariant.initial}
            animate={currentVariant.animate}
            exit={currentVariant.exit}
            transition={currentVariant.transition}
            className="relative left-1/2 top-1/2 max-h-[80%] min-h-[50%] min-w-[50%] max-w-[90%] rounded-md bg-white px-4 py-6"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-0 top-0 z-10 h-8 w-8 rounded-full hover:bg-gray-300"
            >
              X
            </button>
            <div className="scroll-container relative max-h-full overflow-auto rounded-md">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
