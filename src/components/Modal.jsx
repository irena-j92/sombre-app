import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ title, children, onClose }) {
  const panel = useRef(null);
  const closeButton = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const frame = panel.current.closest('.app-frame');
    const siblings = frame ? [...frame.children].filter((node) => !node.contains(panel.current)).map((node) => [node, node.inert]) : [];
    siblings.forEach(([node]) => { node.inert = true; });
    closeButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close.current();
      if (event.key === 'Tab') {
        const controls = [...panel.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]')];
        const first = controls[0]; const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      siblings.forEach(([node, inert]) => { node.inert = inert; });
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return createPortal(<div className="modal-backdrop" onClick={() => close.current()}>
    <section ref={panel} role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="modal-panel" onClick={(event) => event.stopPropagation()}>
      <button ref={closeButton} className="modal-close icon-button" aria-label="Close" onClick={() => close.current()}><X size={20} strokeWidth={1} /></button>
      <h2 id="dialog-title">{title}</h2><div className="modal-content">{children}</div>
    </section>
  </div>, document.querySelector('.app-frame') || document.body);
}
