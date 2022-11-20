import rosetta from 'rosetta';
import en from './en.json';
const i18n = rosetta({
  en: en,
});

// import indonesian dict language
import id from './id.json';
i18n.set('id', id);

i18n.locale('en');
export default i18n;
