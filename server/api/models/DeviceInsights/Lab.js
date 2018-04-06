module.exports = {
  attributes: {
    LAB_ID: { primaryKey: true },
    LAB_NAME: { type: 'string' },
    ADDR: { type: 'string' },
    CITY: { type: 'string' },
    ZIP: { type: 'string' },
    FAX: { type: 'string' },
    EMAIL: { type: 'string' },
    PHONE: { type: 'string' },
    CODE: { type: 'string' },
    STATE_ID: { type: 'integer' },
    ICON: { type: 'text' },
    LATITUTE: { type: 'float' },
    LONGITUTE: { type: 'float' },
    IS_ACTIVE: { tyep: 'boolean' }
  },
  tableName: 'DI_LAB'
};
