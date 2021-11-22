import {useAddonState, useChannel, useStorybookApi} from '@storybook/api';
import {
  eventToShortcut,
  shortcutMatchesShortcut,
  shortcutToHumanString,
} from '@storybook/api/shortcut';
import {IconButton} from '@storybook/components';
import {PREVIEW_KEYDOWN, STORY_RENDERED} from '@storybook/core-events';
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {buildTree, listHeadings} from "yoxel";

import PoleaxeIcon from '../assets/logo'
import {ADDON_ID} from '../constants';
import {focusInInput, getHeaderPrefix, getStoryFrame, getStoryTarget} from "./utils";

const shortcut = ['control', 'shift', 'P'];

const getBox = (node: Element, depth = 0): DOMRect => {
  const box = node.getBoundingClientRect();
  if (box.width > 1) {
    return box;
  }
  if (depth > 10) {
    return box;
  }
  if (node.previousElementSibling) {
    return getBox(node.previousElementSibling, depth + 1);
  }
  if (node.parentElement) {
    return getBox(node.parentElement, depth + 1);
  }
  return box;
}

export const Switcher = () => {
  const [enabled, setEnabled] = useAddonState(ADDON_ID + '/tagger', false);

  const api = useStorybookApi();

  const toggleTagger = useCallback(() => {
    setEnabled(!enabled);
  }, [setEnabled, enabled]);

  // Keyboard events
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (focusInInput(event)) return;
      if (shortcutMatchesShortcut(eventToShortcut(event)!, shortcut)) {
        event.preventDefault();
        event.stopPropagation()
        toggleTagger();
      }
    };
    const passToHander = (data: { event: KeyboardEvent }) => void handler(data.event);

    document.addEventListener('keydown', handler);
    api.on(PREVIEW_KEYDOWN, passToHander);
    return () => {
      document.removeEventListener('keydown', handler);
      api.off(PREVIEW_KEYDOWN, passToHander);
    }
  }, [api, toggleTagger]);

  const [update, setUpdate] = useState({});

  useChannel({
    [STORY_RENDERED]: () => setUpdate({}),
  });

  useEffect(() => {
    const storyFrame = getStoryTarget();
    const storyDoc = getStoryFrame()!;
    if (storyFrame && enabled) {
      const hovers: HTMLDivElement[] = [];
      const hoverMap = new WeakMap<HTMLElement, HTMLDivElement>();

      const createHL = (doc: Document): HTMLDivElement => {
        const hl = doc.createElement('div')
        hl.id = 'poleaxe-highlight';
        doc.body.appendChild(hl);
        hovers.push(hl);
        return hl;
      }

      const updateReport = () => {
        const headers = listHeadings(buildTree(storyFrame));
        const usedHovers = new Set(hovers);
        const scrollLeft = storyDoc.defaultView!.scrollX;
        const scrollTop = storyDoc.defaultView!.scrollY;
        headers.forEach(h => {
          const node = h.node;
          const hl = hoverMap.get(node) || createHL(storyDoc);
          hoverMap.set(node, hl);
          usedHovers.delete(hl);

          const box = getBox(node);
          hl.innerHTML = `<span 
style="background-color: rgba(255,150,150,0.8);color:#FFF;font-size: 10px;padding: 2px;text-shadow: 0 0 1px #000;top:0;transform: translateY(-100%);position:absolute">
${getHeaderPrefix(h)}${node.tagName}
</span>`;

          Object.assign(hl.style, {
            left: (box.left + scrollLeft) + 'px',
            top: (box.top + scrollTop) + 'px',
            width: (box.width-2) + 'px',
            height: box.height + 'px',
            position: 'absolute',
            border: '1px solid rgba(255,200,200,0.2)',
            borderTop: '1px solid rgba(255,200,200,0.8)',
            // backgroundColor: 'rgba(200,200,255,0.05)',
            pointerEvents: 'none',
            display: 'block'
          });
        });
        usedHovers.forEach(h => h.parentNode?.removeChild(h));
      }
      updateReport();

      const observer = new MutationObserver(() => updateReport());
      observer.observe(storyFrame, {subtree: true, childList: true});
      return () => {
        observer.disconnect();
        hovers.forEach(h => h.parentNode?.removeChild(h));
      }
    }
    return () => null;
  }, [update, enabled]);

  return (
    <>
      <IconButton
        title={`Turn on a11y poleaxe [${shortcutToHumanString(
          shortcut,
        )}]`}
        active={enabled}
        onClick={toggleTagger}
      >
        <PoleaxeIcon/>
      </IconButton>
    </>
  );
};