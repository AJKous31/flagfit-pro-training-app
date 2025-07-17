/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "u64muoky08ag0gi",
    "created": "2025-07-14 15:44:12.860Z",
    "updated": "2025-07-14 15:44:12.860Z",
    "name": "training_sessions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qgoft7ov",
        "name": "user_id",
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
  const collection = dao.findCollectionByNameOrId("u64muoky08ag0gi");

  return dao.deleteCollection(collection);
})
