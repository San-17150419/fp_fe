import React, { useRef, useEffect } from "react";
import useCloseAndEscape from "../../../hooks/useCloseAndEscape";
import { AnimatePresence, motion } from "framer-motion";
type ModalProps = {
  children?: React.ReactNode;
  onClose: () => void;
  openModal: boolean;
  enter?: "leftTop" | "leftMiddle";
};

const leftTop = {
  initial: { x: "-100vw", y: "-100vh", scale: 0.2 },
  animate: { x: "-50%", y: "-50%", scale: 1 },
  exit: { x: "-100vw", y: "-100vh", scale: 0.2 },
  transition: { ease: "easeOut", duration: 0.8 },
};

const leftMiddle = {
  initial: { x: "-100vw", y: "-50%", scale: 0.2 },
  animate: { x: "-50%", y: "-50%", scale: 1 },
  exit: { x: "-100vw", y: "-50%", scale: 0.2 },
  transition: { ease: "easeOut", duration: 0.8 },
};

export default function Modal({
  children,
  onClose,
  enter = "leftTop",
  openModal,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openModal]);

  // useClose(modalRef, onClose);
  // useEscape(modalRef, onClose);
  useCloseAndEscape(modalRef, onClose);
  return (
    <>
      <AnimatePresence>
        {openModal && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 top-0 z-50 flex bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeOut", duration: 0.8 }}
          >
            <motion.div
              initial={
                enter === "leftTop" ? leftTop.initial : leftMiddle.initial
              }
              animate={
                enter === "leftTop" ? leftTop.animate : leftMiddle.animate
              }
              exit={enter === "leftTop" ? leftTop.exit : leftMiddle.exit}
              transition={
                enter === "leftTop" ? leftTop.transition : leftMiddle.transition
              }
              className="relative left-1/2 top-1/2 max-h-[80%] min-h-[50%] min-w-[50%] max-w-[90%] rounded-md bg-white px-4 py-6"
              ref={modalRef}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-0 top-0 z-10 h-8 w-8 rounded-full hover:bg-gray-300"
              >
                X
              </button>
              <div className="relative max-h-full overflow-auto rounded-md border hover:border-black">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
