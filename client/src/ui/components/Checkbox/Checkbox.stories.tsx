import { useState } from 'react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Common/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
};

export const Interactive = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={setChecked} />;
};

export const Unchecked = () => {
  return <Checkbox checked={false} onChange={() => {}} />;
};

export const Checked = () => {
  return <Checkbox checked={true} onChange={() => {}} />;
};
