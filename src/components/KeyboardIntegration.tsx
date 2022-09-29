import { API } from '@storybook/api';
import { eventToShortcut, shortcutMatchesShortcut, shortcutToHumanString } from '@storybook/api/shortcut';
import { PREVIEW_KEYDOWN } from '@storybook/core-events';
import { FC, useEffect } from 'react';

import { focusInInput } from './utils';

export const KeyboardIntegration: FC<{
  api: API;
  shortcut: string[];
  toggleTagger(): void;
  reportShortcut(name: string): void;
}> = ({ api, toggleTagger, shortcut, reportShortcut }) => {
  // Keyboard events
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (focusInInput(event)) return;
      if (shortcutMatchesShortcut(eventToShortcut(event)!, shortcut)) {
        event.preventDefault();
        event.stopPropagation();
        toggleTagger();
      }
    };
    const passToHander = (data: { event: KeyboardEvent }) => void handler(data.event);

    document.addEventListener('keydown', handler);
    api.on(PREVIEW_KEYDOWN, passToHander);

    reportShortcut(shortcutToHumanString(shortcut));
    return () => {
      document.removeEventListener('keydown', handler);
      api.off(PREVIEW_KEYDOWN, passToHander);
    };
  }, [api, reportShortcut, shortcut, toggleTagger]);

  return null;
};
