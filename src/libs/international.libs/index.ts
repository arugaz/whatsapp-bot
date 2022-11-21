import rosetta from 'rosetta';

// import english dict & call rosetta function
import en from './en.json';
const i18n = rosetta({
  en: en,
});

// import & set indonesian dict
import id from './id.json';
i18n.set('id', id);

// you can add your language
// import in from './in.json';
// i18n.set('in', in);

// set default language!
i18n.locale('en');
export default i18n;
