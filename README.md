# Meteor Booklist

## Getting started

To start the server in dev mode:

```bash
npm i -g meteor
npm install
npm run dev
```

Then visit http://localhost:3000

To build and launch a production-ready docker container with bundled MongoDB and sqlite instance (requires Docker):

```bash
npm start
```

Then visit http://localhost:80

## Highlights

This project shows how MeteorJS can be used with data sources other than MongoDB. See:
* `imports/Books/Books.api.js`

It also demonstrates a simple way to do isomorphic routing with React Router and hand-rolled,
server-side data loaders. See:
* the exported `{...}Routes` objects in `imports/App/App.jsx` and `imports/App/Home.page.jsx`; and,
* the bookLoader in `Books/Books.page.jsx`

Then you can see how those route/loaders are used in:
* `imports/server.js`; and,
* `imports/client.js`

Finally, it provides validation methods that can be used with Joi (or other) schemas and plugged
into Meteor methods, REST endpoints, database methods, or form libraries such as @mantine/form. See how
`validateWithJoi` and `ValidatedMethod` are used in:

* `imports/Books/Book.form.jsx`; and,
* `imports/Books/Book.api.js`

Feel free to use the convenience methods `publishWithPolling`, `routesFrom`, `useMeteorSubscription`,
and `ValidatedMethod` in your own Meteor apps.

## Author

My name is Abraham Serafino, and although you may not have guessed, I am crazy about MeteorJS. All my contact info
is available at the bottom of my website - [www.AbrahamSerafino.com](http://www.AbrahamSerafino.com/)
