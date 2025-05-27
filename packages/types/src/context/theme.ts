export type Theme = 'dark' | 'light';
export type DataShade = '900' | '800' | '925' | '950' | 'Glassy' | string;
export type DataRounded =
  | 'none'
  | 'small'
  | 'default'
  | 'medium'
  | 'large'
  | 'xlarge'
  | '2xlarge'
  | '3xlarge'
  | 'full';

// Define the shape of the context data
export interface ThemeContext {
  theme: Theme;
  dataShade: DataShade;
  dataRounded: DataRounded;
  toggleTheme: () => void;
}

export type ThemeProvider = {
  dataShade: DataShade;
  dataRounded: DataRounded;
};