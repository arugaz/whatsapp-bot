declare type Config = {
  /**
   * List of bot owners! set your phone number here for manage bot
   * @type {string[]}
   * @example
   * ownerNumber: ['628xxxxxxxxxx', '918xxxxxxxxxx']
   */
  ownerNumber: string[];

  /**
   * Set a default prefix of bot! u can fill '#@' for double prefix or as much as you want '!@#$%^&/.'
   * @type {string}
   * @example
   * prefix: "/" || "/#" || "!@#$%^."
   */
  prefix: string;

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
   * Set a default footer for messages that require a footer
   * @type {number}
   * @example
   * footer: "@arugaz"
   */
  footer: string;
};
