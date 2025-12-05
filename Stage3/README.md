## SCM Strategy

We use **GitHub** as the version control platform and follow a **Simplified Git Flow** branching strategy:

- **main**: Stable production branch.  
- **dev**: Primary development branch created from `main`.  
- **feature branches**: Each feature or task is developed in its own branch created from `dev`.  

### Workflow

1. Developers create feature branches from `dev`.  
2. Work is committed **regularly**.  
3. A **Pull Request (PR)** is opened to merge the feature branch into `dev`.  
4. **One or two reviewers** must approve the PR.  
5. After approval, the PR creator merges the feature branch into `dev`.  
6. Once development is complete, `dev` is merged into `main` for production release.


## Quality Assurance

### Testing objectives

- Ensure all exposed API endpoints behave correctly when called through their real HTTP interface.
- Verify that the most critical user flows work end to end after each significant change or deployment.
- Detect breaking changes early through focused integration and smoke testing, without maintaining a separate unit test suite.
  
### Testing levels and scope

- **Integration testing (API level):**
  - Validate request/response contracts, status codes, and error handling for each endpoint.
  - Check that dependent components (database, external services) work together correctly through the API surface.
- **Smoke testing (end-to-end level):**
  - Validate that the application is deployable and stable.
  - Confirm that a small set of critical user journeys can be completed without errors.

### Testing approach

- The project relies on **integration tests** at the API level instead of unit tests, focusing on real HTTP calls and realistic data rather than internal implementation details.
- **Manual smoke tests** are performed on the deployed environment to quickly assess build stability and core functionality before further testing or release.

### Tools

- **Swagger UI (API integration testing):**
  - Use Swagger UI to explore and execute API endpoints directly from the OpenAPI/Swagger documentation.
  - For each endpoint, define “happy path” and basic negative scenarios, then trigger them from Swagger UI and verify responses (status codes, payload schema, and key business rules).
  - Keep the OpenAPI specification up to date so that the documentation reflects the actual behavior of the API.

- **Issue tracker (test management):**
  - Record test scenarios, expected results, and actual results in the project’s issue tracker Jira
  - Log any defects discovered during Swagger-based integration testing or smoke testing with clear reproduction steps.

### Integration testing process (Swagger)

1. Identify all public API endpoints and ensure they are described in the OpenAPI/Swagger specification.
2. For each endpoint, design:
   - At least one valid “happy path” request.
   - One or more negative cases (invalid data, missing fields, unauthorized access, etc.).
3. Execute these requests using Swagger UI:
   - Confirm the HTTP status codes are correct (e.g., 2xx for success, 4xx/5xx for errors).
   - Confirm the response body matches the documented schema and business rules.
4. Mark each test as passed/failed in a simple checklist and create issues for any failures

### Manual smoke testing process

1. **Scope:** Focus on a small set of high‑value, high‑risk flows, such as:
   - Application start and basic navigation.
   - User authentication (sign up / login / logout).
   - One or two primary business actions for this project (for example: creating a record, submitting a form, or completing a main transaction).
2. **Execution:**
   - Run smoke tests on the deployed environment after each significant change, deployment, or at the start of a testing cycle. 
   - Execute each flow manually from the UI or external client, observing that the flow completes without errors or blockers.
3. **Exit criteria:**
   - If all smoke tests pass, the build is considered stable enough for further testing or demo.
   - If any smoke test fails, the build is rejected, issues are logged, and fixes are required before proceeding. 
