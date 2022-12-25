declare type Config = {
  /**
   * Set a default timezone
   * @type {string}
   * @example
   * timeZone: "America/Los_Angeles"
   */
  timeZone: string;

  /**
   * Set a default bot language
   * @type {string}
   * @example
   * language: "en" | "id" | "pt" | "in" or other..
   */
  language: string;

  /**
   * List of bot owners! set your phone number here for manage bot
   * @type {string[]}
   * @example
   * ownerNumber: ['628xxxxxxxxxx', '918xxxxxxxxxx']
   */
  ownerNumber: string[];
  /**
   * Read the status of users that you have saved in contacts
   * @type {boolean}
   * @example
   * readStatus: true
   */
  readStatus: boolean;
  /**
   * Read messages from chats
   * @type {boolean}
   * @example
   * readStatus: true
   */
  readMessage: boolean;

  /** Anti call from users */
  antiCall: {
    /**
     * Reject call from user
     * @type {boolean}
     * @example
     * readStatus: true
     */
    reject: boolean;
    /**
     * Block user that call bot
     * @type {boolean}
     * @example
     * readStatus: true
     */
    block: boolean;
    /**
     * Ban user that call bot
     * @type {boolean}
     * @example
     * readStatus: true
     */
    ban: boolean;
  };
  /** User config */
  user: {
    /**
     * Set a default limit for every user
     * @type {number}
     * @example
     * limit: 30
     */
    limit: number;
  };
  /**
   * Set a default prefix of bot! u can fill '#@' for double prefix or as much as you want '!@#$%^&/.'
   * @type {string}
   * @example
   * prefix: "/" || "/#" || "!@#$%^."
   */
  prefix: string;
  /**
   * Set a default bot name
   * @type {number}
   * @example
   * name: "Kobeni"
   */
  name: string;
  /**
   * Set a default footer for messages that require a footer
   * @type {number}
   * @example
   * footer: "@arugaz"
   */
  footer: string;
};
