/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "qo70qwnm31wtl62",
    "created": "2025-07-14 15:46:16.492Z",
    "updated": "2025-07-14 15:46:16.492Z",
    "name": "field_2",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "azccqqur",
        "name": "session_type",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("qo70qwnm31wtl62");

  return dao.deleteCollection(collection);
})
