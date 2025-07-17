/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "b9pl8uolo1jnoqn",
    "created": "2025-07-14 15:45:42.718Z",
    "updated": "2025-07-14 15:45:42.718Z",
    "name": "Field_1",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xw2tva16",
        "name": "user__id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
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
  const collection = dao.findCollectionByNameOrId("b9pl8uolo1jnoqn");

  return dao.deleteCollection(collection);
})
