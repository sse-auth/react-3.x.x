import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import Button from './sse-ui/Button';

const ToggleTheme: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button.Root onClick={toggleTheme} size="sm" variant="soft" intent="gray">
      <Button.Icon type="only">{theme === 'light' ? <Sun /> : <Moon />}</Button.Icon>
    </Button.Root>
  );
};

export default ToggleTheme;
