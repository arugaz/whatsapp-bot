import Translate from "@arugaz/translator";

// call function

const International = Translate();

// import & set indonesian dict
import id from "./id.json";
International.set("id", id);

// import & set english dict
import en from "./en.json";
International.set("en", en);

/** you can add your language || disable the languages you don't want to use as it will eat up a lot of ram as well :> */
// import in from './in.json';
// International.set('in', in);

// set default language!
International.locale("en");
export default International.translate;
