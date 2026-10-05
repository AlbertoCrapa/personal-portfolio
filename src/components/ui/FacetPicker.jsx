import React from 'react';
import { X } from 'lucide-react';

import { Combobox } from '../arc/combobox/combobox';
import { Badge } from '../arc/badge/badge';
import styles from './FacetPicker.module.css';

/**
 * FacetPicker — pick several tags out of a long list.
 *
 * Arc has no searchable multi-select, so this composes Arc's combobox (type to
 * filter, a list capped at 300px that scrolls on its own without dragging the
 * page) as an "add a tag" field: each pick joins the selection and the field
 * clears for the next one. The selection shows underneath as removable
 * badges. Options carry how many items use them, most used first.
 *
 * Props: label, placeholder, options [{ value, label, count }], value, onValueChange
 */
const FacetPicker = ({ label, placeholder, options, value = [], onValueChange, emptyMessage }) => {
    const selected = new Set(value);
    const available = options
        .filter((option) => !selected.has(option.value))
        .map((option) => ({ value: option.value, label: `${option.label} (${option.count})` }));

    return (
        <div className={styles.picker}>
            <Combobox
                label={label}
                placeholder={placeholder}
                emptyMessage={emptyMessage}
                options={available}
                value=""
                onValueChange={(next) => {
                    if (next && !selected.has(next)) onValueChange([...value, next]);
                }}
            />
            {value.length > 0 && (
                <ul className={styles.selected} aria-label={`Selected ${label.toLowerCase()}`}>
                    {value.map((tag) => (
                        <li key={tag}>
                            <button
                                type="button"
                                className={styles.chip}
                                onClick={() => onValueChange(value.filter((item) => item !== tag))}
                                aria-label={`Remove ${tag}`}
                            >
                                <Badge size="sm" icon={<X size={12} strokeWidth={1.75} />}>{tag}</Badge>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FacetPicker;
