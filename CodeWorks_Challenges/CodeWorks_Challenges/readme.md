# Auth0 Server Setup

This template is designed to help kickstart a project that utilizes <a href="https://auth0.com/" target="_blank">Auth0.</a> The bulk of the structure has been setup and requires a few pieces of configuration.

The first thing you will need to provide is in the `.env` file. You will need to supply the port, Auth0 credentials, and mongoDb connectionstring. These environment variables are used throughout the template, so be sure to add them in when moving into production as well.

**_.env_**

```
NODE_ENV=dev
PORT=
CONNECTION_STRING=
AUTH_DOMAIN=
AUTH_AUDIENCE=
AUTH_CLIENT_ID=
```

### MVC - Controllers

This template will automatically register all of the controllers found in the controllers folder of the server. This opinionated workflow should help provide a structure on how to build your api. Generally speaking every controller method should start with a `try catch block` and utilize the default error handler setup in Startup.js This means if a request ever fails the controller should call the next function with the error provided.

### MVC - Services

Services are responsible for implementing and enforcing your business rules. Be sure to use them wisely and do not put your business logic in controllers. Services should be usable by both controllers and sockets and potentally other services. Never directly access the `DbContext` outside of a service.

### MVC - (Models, Collections & DbContext)

Models are defined as mongoose schemas and then imported into a central location called the DbContext. All access to the database should be limited to the DbContext. `Collections.js` is a file purely designed to avoid the common problem of magic strings. This means when you register your models and have dependencies or relationships between one or more models you should import from Collections so you know the naming is always the same.

### Working with Auth0

This library provides easily configured middleware that will validate user auth tokens, roles, permissions and provides a simple approach to get userInfo associted with a user account. Each middleware will call next with an error on any failure so be sure to setup a default error handler. Also note that we extend the express request object with

- req.user: `{ UserIdentity }`
- req.userInfo: `{ UserInfo }`

### Login Userflow (required)

In your auth0 dashboard you will want to create a custom userflow for login called `ExtendUserInfo`

```javascript
/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  if (!event.user.app_metadata.id) {
    const id = generateId()
    api.user.setAppMetadata('id', id)
    api.idToken.setCustomClaim('id', id)
    api.accessToken.setCustomClaim('id', id)
  }

  extendTokens(event, api)
};

function extendTokens(event, api) {
  const { identifier } = event.resource_server
  const app_metadata = event.user.app_metadata
  for (const key in app_metadata) {
    const prop = `${identifier}/${key}`
    const value = app_metadata[key];
    api.idToken.setCustomClaim(prop, value);
    api.accessToken.setCustomClaim(prop, value);
  }
}

function generateId() {
  let timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (
    Math.random() * 16 | 0).toString(16)).toLowerCase();
}
```

Example of how to use and configure auth0Provider, You can configure the auth0Provider anywhere in your application and then import it and use the middleware anywhere

```javascript
import { auth0Provider } from "@bcw/auth0-server";

auth0Provider.configure({
  domain: process.env.AUTH_DOMAIN,
  clientId: process.env.AUTH_CLIENT_ID,
  audience: process.env.AUTH_AUDIENCE
});

// validates a request has a Bearer auth token in req.headers.authentication
app.use("/authenticated", auth0Provider.isAuthenticated, (req, res, next) => {
  res.send({ userIdentity: req.user });
});

// validates the request token and extracts the userInfo saved in auth0
app.use("/user-profile", getAuthorizedUserInfo, (req, res, next) => {
  res.send({ userIdentity: req.user, userInfo: req.userInfo });
});

// validates the request token, extracts the userIdentity and userInfo
// fails if role is not found in the token
// Enable RBAC or Extended Rules
app.use(
  "/admins-only",
  auth0Provider.hasRoles("admin"),
  (req, res, next) => {}
);

// validates the request token, extracts the userIdentity and userInfo
// fails if any permission is not found in the token
// Enable RBAC or Extended Rules
app.use(
  "/messages",
  auth0Provider.hasPermissions(["read:messages", "write:messages"]),
  (req, res, next) => {}
);

//recommended default error handler
app.use((error, req, res, next) => {
  if (error.status == 500 || !error.status) {
    error.message = console.error(error); // should write to external
  }
  error = error || {
    status: 400,
    message: "An unexpected error occured please try again later"
  };
  res.status(error.status).send({ ...error, url: req.url });
});
```

Using chained methods with express.Router()

```javascript
express
  .Router()
  .get("", this.getAll)
  .use(AuthorizationService.isAuthorized)
  // everything below this point requires authorization
  .get("/:id", this.getById);
  .put("/:id", this.updateById);
  .use(AuthorizationService.hasPermission("delete:blog"))
  // requires permission to reach this point
  .delete("/:id", this.deleteById);
```

## Legal Overview

The content under the CodeWorks®, LLC Organization and all of the individual repos are solely intended for use by CodeWorks Instruction to deliver Educational content to CodeWorks Students.

---

## Copyright

© CodeWorks® LLC, 2021. Unauthorized use and/or duplication of this material without express and written permission from CodeWorks, LLC is strictly prohibited.


<img src="https://bcw.blob.core.windows.net/public/img/7815839041305055" width="125">

