import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import type { ReactNode } from "react";

interface ModalProps{
   children: ReactNode;
}
export default function Modal({children}:ModalProps) {
  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true">
      <div className={css.modal} >{children}</div>
    </div>,
    document.body
  );
}
