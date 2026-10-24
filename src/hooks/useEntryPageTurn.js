import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion.js';
import { shouldCommitTurn, turnProgress } from '../lib/pageTurn/gesture.js';

export function useEntryPageTurn({ today, draft, navigate, openOnMount = false }) {
  const currentPaper = useRef(null);
  const nextPaper = useRef(null);
  const canvas = useRef(null);
  const fallbackLayer = useRef(null);
  const fallbackFactory = useRef(null);
  const initialOpened = useRef(false);
  const keyboardInput = useRef(false);
  const [rendererMode, setRendererMode] = useState('preparing');
  const engine = useRef(null);
  const cache = useRef(null);
  const operation = useRef(null);
  const gesture = useRef(null);
  const generation = useRef(0);
  const alive = useRef(true);
  const gpuFailed = useRef(false);
  const [turning, setTurning] = useState(false);
  const [landed, setLanded] = useState(false);
  const reducedMotion = useReducedMotion();
  const direction = today ? -1 : 1;
  const target = today ? 'entry' : 'todays-entry';
  const key = `${today}:${draft.mood}:${draft.mode}:${draft.note}`;

  const hideCanvas = useCallback(() => {
    if (canvas.current) canvas.current.style.visibility = 'hidden';
    if (fallbackLayer.current) fallbackLayer.current.style.visibility = 'hidden';
  }, []);
  const abort = useCallback(() => {
    operation.current = null;
    gesture.current = null;
    engine.current?.cancel();
    hideCanvas();
  }, [hideCanvas]);

  const ensureReady = useCallback(() => {
    if (reducedMotion) return Promise.resolve(null);
    if (cache.current?.key === key) return cache.current.promise;
    const token = generation.current;
    const record = { key, promise: null };
    record.promise = (async () => {
      const [graphics, capture, fallback] = await Promise.all([
        window.WebGL2RenderingContext && !gpuFailed.current ? import('../lib/pageTurn/engine.js') : Promise.resolve(null),
        import('../lib/pageTurn/capture.js'), import('../lib/pageTurn/fallback.js'),
      ]);
      if (!alive.current || token !== generation.current) return null;
      const { captureEntryPaper, paintEntryPaper, paintBookCover } = capture;
      fallbackFactory.current = fallback.createFallbackPageTurnEngine;
      await document.fonts?.ready;
      if (!alive.current || token !== generation.current || !currentPaper.current || !nextPaper.current) return null;
      const nativePages = () => [paintEntryPaper(currentPaper.current), paintEntryPaper(nextPaper.current)];
      const pages = graphics && !gpuFailed.current ? await Promise.all([captureEntryPaper(currentPaper.current), captureEntryPaper(nextPaper.current)]) : nativePages();
      if (!alive.current || token !== generation.current) return null;
      if (!engine.current) {
        try {
          if (!graphics || gpuFailed.current) throw new Error('Use compositor page curl');
          engine.current = graphics.createPageTurnEngine(canvas.current, () => {
          gpuFailed.current = true;
          const pending = operation.current;
          abort();
          const lost = engine.current;
          engine.current = null;
          cache.current = null;
          lost?.dispose();
          if (alive.current) {
            setTurning(false);
            if (pending?.release?.commit) { setLanded(true); if (!pending.opening) navigate(pending.target); }
          }
          });
        } catch (error) {
          gpuFailed.current = true;
          engine.current = fallbackFactory.current(fallbackLayer.current);
        }
        setRendererMode(engine.current.type || 'webgl');
      }
      return { renderer: engine.current, pages, paintBookCover, nativePages };
    })().catch((error) => { if (alive.current) console.warn('Entry turn could not prepare.', error); return null; });
    cache.current = record;
    return record.promise;
  }, [abort, key, navigate, reducedMotion]);

  useLayoutEffect(() => {
    generation.current += 1;
    cache.current = null;
    abort();
    setTurning(false);
  }, [key, reducedMotion, abort]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      generation.current += 1;
      cache.current = null;
      abort();
      engine.current?.dispose();
      engine.current = null;
    };
  }, [abort]);


  const finish = useCallback((op) => {
    if (operation.current !== op || !alive.current) return;
    operation.current = null;
    setTurning(false);
    if (op.release.commit) {
      setLanded(true);
      // Canvas stays on the destination until React commits the live page.
      if (op.opening) hideCanvas();
      else navigate(op.target);
      if (!op.renderer) hideCanvas();
    } else hideCanvas();
  }, [hideCanvas, navigate]);

  const settle = useCallback((op) => {
    if (!op.ready || !op.release || operation.current !== op) return;
    if (!op.renderer) { finish(op); return; }
    op.renderer.settle(op.release.commit ? 1 : 0, {
      duration: op.release.duration, direct: op.release.direct,
      onComplete: () => finish(op),
    });
  }, [finish]);

  const begin = useCallback((grabY = 0.25, direct = false, opening = false) => {
    if (operation.current) return null;
    const op = { target, direction, opening, progress: 0, ready: false, renderer: null, release: direct ? { commit: true, duration: 0.72, direct: true } : null };
    operation.current = op;
    setTurning(true);
    ensureReady().then((ready) => {
      if (operation.current !== op || !alive.current) return;
      op.ready = true;
      if (ready) {
        try {
          op.renderer = ready.renderer;
          const pages = opening ? [ready.paintBookCover(), ready.pages[0]] : ready.pages;
          ready.renderer.setPages(...pages, opening ? 1 : direction, grabY);
          ready.renderer.render(op.progress);
          if (ready.renderer.type === 'css') fallbackLayer.current.style.visibility = 'visible';
          else canvas.current.style.visibility = 'visible';
        } catch (error) {
          console.warn('Entry turn switched to the compositor renderer.', error);
          gpuFailed.current = true;
          ready.renderer.dispose();
          engine.current = fallbackFactory.current(fallbackLayer.current);
          ready.renderer = engine.current;
          op.renderer = engine.current;
          setRendererMode('css');
          hideCanvas();
          const native = ready.nativePages();
          const pages = opening ? [ready.paintBookCover(), native[0]] : native;
          op.renderer.setPages(...pages, opening ? 1 : direction, grabY);
          op.renderer.render(op.progress);
          fallbackLayer.current.style.visibility = 'visible';
        }
      }
      settle(op);
    });
    return op;
  }, [direction, ensureReady, hideCanvas, settle, target]);

  const turn = useCallback((event) => {
    if (operation.current) return;
    // Keyboard and reduced-motion navigation do not wait for a visual effect.
    if (reducedMotion || keyboardInput.current) {
      setLanded(true); navigate(target); return;
    }
    begin(0.25, true);
  }, [begin, navigate, reducedMotion, target]);

  useEffect(() => {
    const token = generation.current;
    ensureReady().then((ready) => {
      if (ready && openOnMount && !reducedMotion && !initialOpened.current && alive.current && token === generation.current && !operation.current) {
        initialOpened.current = true;
        begin(0.25, true, true);
      }
    });
  }, [ensureReady, openOnMount, reducedMotion, begin]);

  const onPointerDown = (event) => {
    keyboardInput.current = false;
    if (!event.isPrimary && event.isPrimary !== undefined) return;
    if (event.button !== undefined && event.button !== 0) return;
    if (operation.current || gesture.current || event.target.closest('button, a, textarea, input')) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    gesture.current = {
      pointerId: event.pointerId, x: event.clientX, y: event.clientY,
      lastX: event.clientX, lastTime: performance.now(), velocity: 0,
      width: bounds.width || 393, height: bounds.height || 852, top: bounds.top,
      op: null, vertical: false,
    };
  };
  const onPointerMove = (event) => {
    const drag = gesture.current;
    if (!drag || drag.pointerId !== event.pointerId || drag.vertical) return;
    const dx = (drag.x - event.clientX) * direction;
    const dy = Math.abs(drag.y - event.clientY);
    if (!drag.op) {
      if (dy > 10 && dy > Math.abs(dx)) { drag.vertical = true; return; }
      if (dx < 8 || dx < dy * 1.2) return;
      // Capture only after horizontal intent; native note scrolling stays intact.
      event.currentTarget.setPointerCapture?.(event.pointerId);
      if (!reducedMotion) drag.op = begin(1 - (drag.y - drag.top) / drag.height);
    }
    if (event.cancelable) event.preventDefault();
    const now = performance.now();
    const elapsed = now - drag.lastTime;
    if (elapsed > 0) drag.velocity = ((drag.lastX - event.clientX) * direction) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = now;
    if (drag.op) {
      drag.op.progress = turnProgress(dx, drag.width);
      drag.op.renderer?.render(drag.op.progress);
    }
  };
  const release = (event, cancelled = false) => {
    const drag = gesture.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.vertical) return;
    const distance = (drag.x - event.clientX) * direction;
    const commit = !cancelled && shouldCommitTurn(distance, drag.width, drag.velocity);
    if (!drag.op) {
      if (commit) turn({ detail: reducedMotion ? 0 : 1 });
      return;
    }
    drag.op.release = { commit, duration: 0.18 + 0.5 * (commit ? 1 - drag.op.progress : drag.op.progress), direct: false };
    settle(drag.op);
  };
  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') keyboardInput.current = true;
    if (event.key === 'Escape' && operation.current) {
      gesture.current = null;
      operation.current.release = { commit: false, duration: 0.2 };
      settle(operation.current);
    }
    if ((event.key === 'ArrowRight' && !today) || (event.key === 'ArrowLeft' && today)) {
      event.preventDefault();
      abort(); setTurning(false); setLanded(true); navigate(target);
    }
  };

  return {
    currentPaper, nextPaper, canvas, fallbackLayer, rendererMode, turning, turn, landed, allowFill: () => setLanded(false),
    bindings: { onPointerDown, onPointerMove, onPointerUp: (event) => release(event), onPointerCancel: (event) => release(event, true), onKeyDown },
  };
}
