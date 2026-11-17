import { useEffect, useId } from 'react';

export function useInlineDraft(
  active: boolean,
  finish: () => void,
  escape: () => void,
) {
  const draftId = useId();

  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    // A click on another control in the draft is still part of editing.
    function handleOutside(event: Event) {
      const draft = document.getElementById(draftId);
      if (
        draft &&
        event.target instanceof Node &&
        !draft.contains(event.target)
      )
        finish();
    }

    function handleEscape(event: KeyboardEvent) {
      const draft = document.getElementById(draftId);
      if (
        event.key !== 'Escape' ||
        event.isComposing ||
        !draft?.contains(document.activeElement)
      )
        return;

      event.preventDefault();
      event.stopPropagation();
      escape();
    }

    document.addEventListener('pointerdown', handleOutside, true);
    document.addEventListener('focusin', handleOutside);
    document.addEventListener('keydown', handleEscape, true);
    return () => {
      document.removeEventListener('pointerdown', handleOutside, true);
      document.removeEventListener('focusin', handleOutside);
      document.removeEventListener('keydown', handleEscape, true);
    };
  }, [active, draftId, escape, finish]);

  return draftId;
}
