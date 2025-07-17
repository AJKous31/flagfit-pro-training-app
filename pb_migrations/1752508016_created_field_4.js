/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ybtpqf2zi9hqusm",
    "created": "2025-07-14 15:46:56.844Z",
    "updated": "2025-07-14 15:46:56.844Z",
    "name": "field_4",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "7nj4stsy",
        "name": "exercises",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ybtpqf2zi9hqusm");

  return dao.deleteCollection(collection);
})
