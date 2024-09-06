import React, { useRef } from "react";
import useCloseAndEscape from "../../../hooks/useCloseAndEscape";
import { AnimatePresence, motion } from "framer-motion";

// TODO: The min height and width is not working. Possibly because of the animation.
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
  // TODO: Fix the animation. I might need to avoid using scaling for the animation because it messes up the width of listbox options. I am not sure if I can fix this. It's possible to fix this problem by delaying redering of the children. But that's not a good solution as it might cause performance issues.It also make the visual effect worse because I probably need to delay redering the children AFTER the animation is done.
  const currentVariant = animationVariants[enter];
  currentVariant;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          // The overlay is not reachable by pressing tab
          tabIndex={-1}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          layout
          transition={{ ease: "easeOut", duration: 0.4 }}
          onClick={() => {
            if (modalRef.current) {
              onClose();
            }
          }}
        >
          <motion.div
            // initial={currentVariant.initial}
            // animate={currentVariant.animate}
            layout
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            // exit={currentVariant.exit}
            // transition={currentVariant.transition}
            transition={{ ease: "easeOut", duration: 0.4 }}
            className="relative max-h-[90%] max-w-[70%] overflow-auto rounded-md bg-white px-8 py-12"
            // className="relative left-1/2 top-1/2 max-h-[90%] min-h-[50%] min-w-[50%] max-w-[70%] rounded-md bg-white py-6"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-1 top-1 z-10 h-10 w-10 rounded-full text-base hover:bg-gray-300"
            >
              X
            </button>
            {children}
            {/* <div className="relative mx-3 mt-4  rounded-md outline">
              {children}
            </div> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
// import React, { useRef } from "react";
// import useCloseAndEscape from "../../../hooks/useCloseAndEscape";
// import { AnimatePresence, motion } from "framer-motion";

// // TODO: The min height and width is not working. Possibly because of the animation.
// type ModalProps = {
//   children?: React.ReactNode;
//   onClose: () => void;
//   isOpen: boolean;
//   enter?: "leftTop" | "leftMiddle";
// };
// const animationVariants = {
//   leftTop: {
//     initial: {
//       x: "-100vw",
//       y: "-100vh",
//       width: "100vw",
//       height: "100vh",
//       scale: 0.2,
//     },
//     animate: { x: "-50%", y: "-50%", scale: 1 },
//     exit: { x: "-100vw", y: "-100vh", scale: 0.2 },
//     transition: { ease: "easeOut", duration: 0.8 },
//   },
//   leftMiddle: {
//     initial: {
//       x: "-100vw",
//       y: "-50%",
//       width: "100vw",
//       height: "100vh",
//       scale: 0.2,
//     },
//     animate: { x: "-50%", y: "-50%", scale: 1 },
//     exit: { x: "-100vw", y: "-50%", scale: 0.2 },
//     transition: { ease: "easeOut", duration: 0.8 },
//   },
// };

// export default function Modal({
//   children,
//   onClose,
//   enter = "leftTop",
//   isOpen,
// }: ModalProps) {
//   const modalRef = useRef<HTMLDivElement>(null);

//   useCloseAndEscape(modalRef, onClose, isOpen);

//   const currentVariant = animationVariants[enter];

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed bottom-0 left-0 right-0 top-0 z-50 flex bg-black/50"
//           initial={{ opacity: 0 }}
//           // The overlay is not reachable by pressing tab
//           tabIndex={-1}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ ease: "easeOut", duration: 0.8 }}
//           onClick={() => {
//             if (modalRef.current) {
//               onClose();
//             }
//           }}
//         >
//           <motion.div
//             initial={currentVariant.initial}
//             animate={currentVariant.animate}
//             exit={currentVariant.exit}
//             transition={currentVariant.transition}
//             className="relative left-1/2 top-1/2 max-h-[90%] min-h-[50%] min-w-[50%] max-w-[70%] rounded-md bg-white py-6"
//             ref={modalRef}
//             role="dialog"
//             aria-modal="true"
//             onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
//           >
//             <button
//               type="button"
//               onClick={onClose}
//               aria-label="Close modal"
//               className="absolute right-1 top-1 z-10 h-10 w-10 rounded-full text-base hover:bg-gray-300"
//             >
//               X
//             </button>
//             <div className="scroll-container relative mx-3 mt-4 max-h-full overflow-auto rounded-md">
//               {children}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
