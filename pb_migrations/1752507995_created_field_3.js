/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "pf2vzt81athu9gj",
    "created": "2025-07-14 15:46:35.290Z",
    "updated": "2025-07-14 15:46:35.290Z",
    "name": "field_3",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "eofs9zfc",
        "name": "duration",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
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
  const collection = dao.findCollectionByNameOrId("pf2vzt81athu9gj");

  return dao.deleteCollection(collection);
})
