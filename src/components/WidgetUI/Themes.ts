
const defaultThemes = {
    'dark': {
        primary: 'rgb(217, 224, 33)',
        background: '#0e0e0e',
        mode: 'dark'
    },
    'light': {
        primary: '#309676',
        background: '#fbfbfb',
        mode: 'light'
    }
}


export function getWidgetTheme(themeOpts) {
    if (!themeOpts) return defaultThemes.dark;
    if (themeOpts.mode && !themeOpts.background && !themeOpts.primary) {
        return defaultThemes[themeOpts.mode];
    }
    return themeOpts;
}