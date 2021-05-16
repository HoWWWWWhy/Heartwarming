import Realm from 'realm';
const HEARTWARMING_SCHEMA = 'Heartwarming';
const CATEGORY_SCHEMA = 'Category';
const SETTING_SCHEMA = 'Setting';
const DATA_SCHEMA = 'Data';

const SettingSchema = {
  name: SETTING_SCHEMA,
  embedded: true,
  properties: {
    useBgImage: 'bool',
    bgColor: 'string',
    textColor: 'string',
    bgImage: 'int',
    bgImageBlur: 'double',
    isSelected: 'bool',
  },
};

const DataSchema = {
  name: DATA_SCHEMA,
  embedded: true,
  properties: {
    contents: 'string',
    prepos: 'string',
    source: 'string',
  },
};

const CategorySchema = {
  name: CATEGORY_SCHEMA,
  embedded: true,
  properties: {
    icon: 'string',
    data: DATA_SCHEMA + '[]',
    setting: SETTING_SCHEMA,
  },
};

const HeartwarmingSchema = {
  name: HEARTWARMING_SCHEMA,
  primaryKey: '_id',
  properties: {
    _id: 'int',
    createdDate: 'date',
    categoryTitle: 'string',
    categoryContents: CATEGORY_SCHEMA,
  },
};

const realm = new Realm({
  path: 'test1',
  schema: [HeartwarmingSchema, CategorySchema, SettingSchema, DataSchema],
});

const getAllCategories = () => {
  return realm.objects(HEARTWARMING_SCHEMA);
};

const deleteAllCategories = () => {
  const allCategories = getAllCategories();
  realm.delete(allCategories);
};

const closeRealm = () => {
  realm.close();
};

export default realm;

export {getAllCategories, deleteAllCategories, closeRealm};
