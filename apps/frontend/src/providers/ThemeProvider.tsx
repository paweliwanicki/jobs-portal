import { ReactNode, useContext, useMemo, useState } from 'react';
import { Theme, ThemeContext } from '../contexts/themeContext';

type ThemeProviderProps = {
  children: ReactNode;
};

const isBrowserDefaultDark = (): boolean =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const getDefaultTheme = (): Theme => {
  const localStorageTheme: Theme | null = localStorage.getItem(
    'theme'
  ) as Theme;
  const browserDefaultTheme: Theme = isBrowserDefaultDark() ? 'dark' : 'light';
  return localStorageTheme || browserDefaultTheme;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => getDefaultTheme());

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => useContext(ThemeContext);