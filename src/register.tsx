import addons, { types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

import * as React from 'react';

import { ReportPanel } from './components/Report';
import { Switcher } from './components/Switcher';
import { ADDON_ID } from './constants';

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/switch`, {
    title: 'Story PoleAxe',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <Switcher />,
  });

  addons.add(`${ADDON_ID}/switch`, {
    title: 'A11y PoleAxe',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={Boolean(active)} key={key}>
        {active ? <ReportPanel /> : null}
      </AddonPanel>
    ),
  });
});