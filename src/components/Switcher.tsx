import { useAddonState, useChannel, useParameter, useStorybookApi } from '@storybook/api';
import { IconButton } from '@storybook/components';
import { STORY_RENDERED } from '@storybook/core-events';
import * as React from 'react';
import { FC, useCallback, useEffect, useState } from 'react';

import PoleaxeIcon from '../assets/logo';
import { ADDON_ID, PARAM_KEY } from '../constants';
import { highlightHeadings } from '../tools/highlighter';
import { PoleaxeParams } from '../types';
import { getStoryTarget, isEnabled } from './utils';

const shortcut = ['control', 'shift', 'P'];

export const Switcher: FC<{
  KeyboardIntegration?: typeof import('./KeyboardIntegration').KeyboardIntegration;
}> = ({ KeyboardIntegration }) => {
  const params = useParameter<PoleaxeParams>(PARAM_KEY, {});
  const isEnabledByParams = params.highlighter ?? false;
  const [enabled, setEnabled] = useAddonState(ADDON_ID + '/tagger', isEnabledByParams);
  useEffect(() => {
    setEnabled(isEnabledByParams);
  }, [isEnabledByParams]);

  const api = useStorybookApi();

  const toggleTagger = useCallback(() => {
    setEnabled(!enabled);
  }, [setEnabled, enabled]);

  const [update, setUpdate] = useState({});
  const [shortcutName, setShortcutName] = useState('');

  useChannel({
    [STORY_RENDERED]: () => setUpdate({}),
  });

  useEffect(() => {
    const storyFrame = getStoryTarget();
    if (storyFrame && enabled) {
      const hovers: HTMLDivElement[] = [];
      const map = new WeakMap<HTMLElement, HTMLDivElement>();

      let updateRequested = false;
      const updateReport = () => {
        if (updateRequested) {
          return;
        }
        updateRequested = true;
        requestAnimationFrame(() => {
          updateRequested = false;
          highlightHeadings(storyFrame, hovers, map);
        });
      };
      updateReport();

      const observer = new MutationObserver(() => updateReport());
      if (isEnabled(params.mutationObserver ?? true, 'highlighter')) {
        observer.observe(storyFrame, { subtree: true, childList: true });
        storyFrame.addEventListener('wheel', updateReport);
      }
      return () => {
        observer.disconnect();
        storyFrame.removeEventListener('wheel', updateReport);
        hovers.forEach((h) => h.parentNode?.removeChild(h));
      };
    }
    return () => null;
  }, [update, enabled]);

  return (
    <>
      <IconButton
        title={`Turn on a11y poleaxe ${shortcutName ? `[${shortcutName}]` : ''}`}
        active={enabled}
        onClick={toggleTagger}
      >
        <PoleaxeIcon />
      </IconButton>
      {KeyboardIntegration && (
        <KeyboardIntegration
          api={api}
          shortcut={shortcut}
          toggleTagger={toggleTagger}
          reportShortcut={setShortcutName}
        />
      )}
    </>
  );
};
