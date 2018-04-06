
module.exports = {
  attributes: {
    USER_ID: { primaryKey: true },
    LAB_ID: { type: 'integer' },
    FIRST_NAME: { type: 'string' },
    MIDDLE_NAME: { type: 'string' },
    LAST_NAME: { type: 'string' },
    EMAIL_ID: { type: 'string' },
    PASSWORD: { type: 'string' },
    IS_ACTIVE: { type: 'boolean' },
    ICON: { type: 'string' },
    CREATED_ON: { type: 'datetime' },
    MODIFIED_ON: { type: 'datetime' },
    CREATED_BY: { type: 'integer' },
    MODIFIED_BY: { type: 'integer' }
  },
  tableName: 'DI_USER'
};
