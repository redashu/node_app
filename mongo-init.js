// mongo-init.js
db = db.getSiblingDB('ashudb');
db.users.insert({ "username": "testuser", "password": "testpassword" });
