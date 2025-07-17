/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "e90j3fux88sp2pr",
    "created": "2025-07-14 15:47:15.050Z",
    "updated": "2025-07-14 15:47:15.050Z",
    "name": "Field_5",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "0nfwwzbm",
        "name": "notes",
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
  const collection = dao.findCollectionByNameOrId("e90j3fux88sp2pr");

  return dao.deleteCollection(collection);
})
