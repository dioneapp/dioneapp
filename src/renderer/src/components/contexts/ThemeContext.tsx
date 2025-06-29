import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentPort } from '@renderer/utils/getPort';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [port, setPort] = useState<number | null>(null);

  useEffect(() => {
    // Get the current port
    const fetchPort = async () => {
      try {
        const currentPort = await getCurrentPort();
        setPort(currentPort);
      } catch (error) {
        console.warn('Failed to get port, using default theme:', error);
        // Continue with default theme if port detection fails
      }
    };
    fetchPort();
  }, []);

  useEffect(() => {
    // Load theme from config when port is available
    if (port) {
      // Add a delay to ensure the backend is ready
      const timer = setTimeout(() => {
        loadThemeFromConfig();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    // Return undefined explicitly when port is not available
    return undefined;
  }, [port]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const loadThemeFromConfig = async () => {
    if (!port) return;
    
    try {
      // Add a small delay to ensure backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(`http://localhost:${port}/config`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const config = await response.json();
      if (config && config.theme) {
        setThemeState(config.theme);
      }
    } catch (error) {
      console.warn('Failed to load theme from config, using default:', error);
      // Use default theme if config loading fails
      setThemeState('dark');
    }
  };

  const setTheme = async (newTheme: Theme) => {
    // Always update the UI immediately for better UX
    setThemeState(newTheme);
    
    if (!port) {
      console.warn('Port not available, theme will not be persisted');
      return;
    }
    
    try {
      // Update config on server
      const configResponse = await fetch(`http://localhost:${port}/config`);
      if (!configResponse.ok) {
        throw new Error(`Failed to fetch config: ${configResponse.status}`);
      }
      const currentConfig = await configResponse.json();
      
      const response = await fetch(`http://localhost:${port}/config/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...currentConfig, theme: newTheme }),
      });

      if (response.ok) {
        // Dispatch event for other components to react to theme change
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: newTheme }));
      } else {
        throw new Error(`Failed to update config: ${response.status}`);
      }
    } catch (error) {
      console.warn('Failed to persist theme setting:', error);
      // Theme is still applied locally, just not persisted
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};