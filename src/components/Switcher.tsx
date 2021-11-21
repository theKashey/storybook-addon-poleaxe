import {useAddonState, useStorybookApi} from '@storybook/api';
import {
  eventToShortcut,
  shortcutMatchesShortcut,
  shortcutToHumanString,
} from '@storybook/api/shortcut';
import {IconButton} from '@storybook/components';
import {PREVIEW_KEYDOWN} from '@storybook/core-events';
import * as React from 'react';
import {useCallback, useEffect} from 'react';

import PoleaxeIcon from '../assets/logo'
import {ADDON_ID} from '../constants';
import {focusInInput} from "./utils";

const shortcut = ['control', 'P'];

export const Switcher = () => {
  const [enabled, setEnabled] = useAddonState(ADDON_ID, false);

  const api = useStorybookApi();

  const toggleTagger = useCallback(() => {
    setEnabled(prev => !prev,
      {
        persistence: 'session',
      },
    );
  }, [setEnabled]);

  // Keyboard events
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (focusInInput(event)) return;
      if (shortcutMatchesShortcut(eventToShortcut(event)!, shortcut)) {
        event.preventDefault?.();
        toggleTagger();
      }
    };
    document.addEventListener('keydown', handler);
    // KeyDown events from the preview iframe.
    api.on(
      PREVIEW_KEYDOWN,
      (data: { event: KeyboardEvent }) => void handler(data.event),
    );

    // NOTE; Purposely not cleaning up, this component _shouldnt_ be un-mounting
  }, [api, toggleTagger]);

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