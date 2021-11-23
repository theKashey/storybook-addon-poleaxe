import {useAddonState, useChannel, useParameter, useStorybookApi} from '@storybook/api';
import {
  eventToShortcut,
  shortcutMatchesShortcut,
  shortcutToHumanString,
} from '@storybook/api/shortcut';
import {IconButton} from '@storybook/components';
import {PREVIEW_KEYDOWN, STORY_RENDERED} from '@storybook/core-events';
import * as React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';

import PoleaxeIcon from '../assets/logo'
import {ADDON_ID, PARAM_KEY} from '../constants';
import {highlightHeadings} from "../tools/highlighter";
import {PoleaxeParams} from "../types";
import {focusInInput, getStoryTarget, isEnabled} from "./utils";

const shortcut = ['control', 'shift', 'P'];


export const Switcher: FC = () => {
  const params = useParameter<PoleaxeParams>(PARAM_KEY, {})
  const isEnabledByParams = params.highlighter ?? false;
  const [enabled, setEnabled] = useAddonState(ADDON_ID + '/tagger', isEnabledByParams);
  useEffect(() => {
    setEnabled(isEnabledByParams);
  }, [isEnabledByParams])

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
    if (storyFrame && enabled) {
      const hovers: HTMLDivElement[] = [];
      const map = new WeakMap<HTMLElement, HTMLDivElement>();

      const updateReport = () => {
        highlightHeadings(storyFrame, hovers, map);
      }
      updateReport();

      const observer = new MutationObserver(() => updateReport());
      if (isEnabled(params.mutationObserver ?? true, 'highlighter')) {
        observer.observe(storyFrame, {subtree: true, childList: true});
      }
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