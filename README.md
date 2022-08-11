## 13|37 API Assignment implementation by Anatoly A.

---

### How to start the application locally
Run `npm install && npm start` and make requests to `localhost:3000/`

---

### API documentation
Check the [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

### Implemented features
 - Get all coworkers
 - Basic filtering by name
 - Editing of coworkers
 - Swagger documentation

The reason I've chosen to implement features above is that they seemed the least time-consuming for me.

The plan was to work on containerization of the application and deploying it to the cloud. However, implementation of initial data scrapping turned out to consume most of the time. That's why it was decided to implement the very minimum of the requested features.

---

### TO DO
 1. Split the code that implements data scraping to several more atomic pieces and overall refactor it.
 2. Implement a service for persisting the data instead of reading/writing right in `CoworkerService`. 
 3. Implement adapter between `CoworkerService` and the class responsible for data persistence. `CoworkerService` should know nothing about how data is retrieved (`fs`, Mongo, etc.`)
 4. Utilize some package (e.g. `BottleJS`) for implementation of dependency injection. This way, `CoworkerService` could be injected to middlewares (i.e. `coworker.controller.ts`).
 5. CORS should be properly configured, instead of just allowing everything. It was made for the sake of simplification.
 6. All error messages should be gathered into a single file, instead of specifying the error message simply on place.
 7. Add scripts for:
    - starting in dev mode vs. production mode
    - creating a build
    - running tests, linting and coverage
    - lint autofix
