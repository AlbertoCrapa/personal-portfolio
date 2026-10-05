import React from 'react';

import SegmentedControl from '../arc/segmented-control/segmented-control';
import { useTheme } from './ThemeProvider';

/**
 * ThemeControl — light, system or dark. Three named options that apply at once
 * is Arc's segmented control (theme-switch only toggles two). The palette
 * still wipes in from the bottom edge through ThemeProvider's view transition.
 */
const OPTIONS = [
    { value: 'light', label: 'Light' },
    { value: 'system', label: 'System' },
    { value: 'dark', label: 'Dark' },
];

const ThemeControl = () => {
    const { preference, setPreference } = useTheme();
    return (
        <SegmentedControl
            label="Theme"
            options={OPTIONS}
            value={preference}
            onValueChange={(next) => setPreference(next, 'bottom')}
        />
    );
};

export default ThemeControl;
