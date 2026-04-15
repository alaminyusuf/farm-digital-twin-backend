**Project**: Hydro Manager API

- **Description**: Backend API for a hydroponic SaaS app (Express, MongoDB, JWT
  auth).

**Quick Start**:

- **Install:** `npm install`
- **Run (dev):** `npm run dev` (requires `nodemon`)
- **Run (prod):** `npm start`

**Environment Variables**

- **MONGO_URI:** MongoDB connection string. Default:
  `mongodb://localhost:27017/hydro-manager`
- **JWT_SECRET:** Secret for signing JWTs. Default placeholder:
  `CHANGE_THIS_JWT_SECRET` — change in production.
- **PORT:** Server port. Default: `4000`.
- **NODE_ENV:** `development` or `production`.

Example `.env`:

```
MONGO_URI=mongodb://user:pass@host:27017/your-db
JWT_SECRET=your-super-secret-value
PORT=4000
NODE_ENV=production
```

**Docker**

- Build image: `docker build -t yourname/hydro-backend .`
- Run container:
  `docker run -p 4000:4000 --env-file .env yourname/hydro-backend`

**docker-compose**

- There is a `docker-compose.yml` that defines `backend` and `mongodb`. Ensure
  `MONGO_URI` in environment points to the MongoDB service when using compose.

**Tests**

- Run: `npm test` (uses `jest`)

**CI / CD (GitHub Actions)**

- A workflow is included to run tests, build a Docker image and push to Docker
  Hub. Configure the following repository secrets:
   - `DOCKERHUB_USERNAME` — Docker Hub username
   - `DOCKERHUB_TOKEN` — Docker Hub access token or password
   - `DOCKERHUB_REPO` — Full image name (e.g. `yourname/hydro-backend`)
   - (Optional) `SSH_HOST`, `SSH_USER`, `SSH_KEY` for SSH deploy

**Security Note**

- Replace the default `JWT_SECRET` before deploying to production. The default
  `CHANGE_THIS_JWT_SECRET` is insecure.

**Files of interest**

- `server.js` — app bootstrap
- `config/db.js` — MongoDB connection (reads `MONGO_URI`)
- `controllers/*` — request handlers
- `middleware/authMiddleware.js` — JWT verification (reads `JWT_SECRET`)

**Next Steps**

- Update secrets in repository settings, verify tests, and enable Actions on
  `main` branch.
