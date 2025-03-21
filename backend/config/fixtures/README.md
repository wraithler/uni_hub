# Fixtures

Fixtures can be used to populate the database with initial data when the application is started for the first time.

## Creating Fixtures

```bash
docker exec -it backend python manage.py dumpdata > data.json
```

Then copy the data from the `data.json` you want to the appropriate fixture file in the `backend/config/fixtures` directory.

## Loading Fixtures

The fixtures will be automatically loaded when the application is started for the first time.


