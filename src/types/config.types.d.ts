declare type Config = {
  /**
   * List of bot owners! set your phone number here for manage bot
   * @type {string[]}
   * @example
   * ['628xxxxxxxxxx', '918xxxxxxxxxx']
   */
  ownerNumber: string[];

  /**
   * Set default prefix of bot! u can fill '#@' for double prefix or as much as you want '!@#$%^&/.'
   * @type {string}
   * @example
   * '/' || '/#'
   */
  prefix: string;
};
