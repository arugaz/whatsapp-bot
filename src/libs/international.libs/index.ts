import rosetta from "rosetta";

// import english dict & call rosetta function
import en from "./en.json";
const International = rosetta({
  en: en,
});

// import & set indonesian dict
import id from "./id.json";
International.set("id", id);

// you can add your language
// import in from './in.json';
// International.set('in', in);

// set default language!
International.locale("en");
export default International;
