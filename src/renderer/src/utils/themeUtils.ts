// Utility functions for theme-aware styling
export const getThemeClasses = (darkClass: string, lightClass: string) => {
  return `${darkClass} dark:${darkClass} light:${lightClass}`;
};

export const getBackgroundClass = () => {
  return 'bg-background dark:bg-background light:bg-background-light';
};

export const getTextClass = (variant: 'primary' | 'secondary' | 'muted' = 'primary') => {
  switch (variant) {
    case 'primary':
      return 'text-text-primary dark:text-text-primary light:text-text-primary-light';
    case 'secondary':
      return 'text-text-secondary dark:text-text-secondary light:text-text-secondary-light';
    case 'muted':
      return 'text-text-muted dark:text-text-muted light:text-text-muted-light';
    default:
      return 'text-text-primary dark:text-text-primary light:text-text-primary-light';
  }
};

export const getBorderClass = () => {
  return 'border-border dark:border-border light:border-border-light';
};

export const getSurfaceClass = () => {
  return 'bg-surface dark:bg-surface light:bg-surface-light';
};