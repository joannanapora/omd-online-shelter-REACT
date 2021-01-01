import React from 'react';

import { CheckBox } from 'grommet';
import { normalizeColor } from 'grommet/utils';

import { FormCheckmark } from 'grommet-icons';


class CustomCheckBox extends React.Component<{ onChange: (event: any) => void, checked: boolean, label: string }, {}> {
    constructor(props) {
        super(props);
    };


    customCheckBoxTheme = {
        checkBox: {
            border: {
                color: {
                    light: 'brand',
                },
                // width: 'xsmall',
                radius: '5px',
            },
            check: {
                extend: ({ theme, checked }) => `
          ${checked && `background-color: ${normalizeColor('brand', theme)};`}
          `,
            },
            color: {
                light: 'brand',
                dark: 'brand',
            },
            hover: {
                border: {
                    color: 'brand',
                },
            },
            icon: {
                size: '18px',
                extend: 'stroke: white;',
            },
            icons: {
                checked: FormCheckmark,
            },
            size: '30px',
            extend: `
        color: 'brand';
      `,
        },
    };
    render() {
        return (
            <CheckBox
                label={this.props.label}
                checked={this.props.checked}
                onChange={this.props.onChange}
            />
        );
    };
}

export default CustomCheckBox;