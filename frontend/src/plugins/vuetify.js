import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          background: '#ffffff',
          surface: '#ffffff',
          primary: '#6200ea',
          secondary: '#03dac6',
          error: '#b00020',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#fb8c00',
        },
        fonts: {
          body: 'Roboto, sans-serif',
          heading: 'Roboto, sans-serif',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

export default vuetify;
