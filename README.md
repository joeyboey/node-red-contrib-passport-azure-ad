# node-red-contrib-passport-azure-ad

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Node.js Version][node-image]][node-url]

Custom Nodes for [Node RED](https://nodered.org) to allow bearer authentication via [passport-azure-ad][passport-npmjs-url].

The add-on is still in early development and the functionality will be enhanced
over time.

## Installation

Right now there are to available options to install Node RED add-ons.

### Via the Web-Interface

1. Open the menu in the upper right corner
2. Choose **Manage Palette**
3. Under **Install**, search for: *node-red-contrib-passport-azure-ad*

### Via the command line

1. Navigate to your Node RED user directory, usally `$HOME/.node-red`
2. Run the following command:

```shell
npm install node-red-contrib-passport-azure-ad
```

---

## Usage

Right now the is just a single Node implemented.

## Config Node

Before using any nodes you have to configure the Active Directory. For that you have
the option to create config nodes from within the normal nodes.

You only need 3 parameters from your Cosmos Database:

1. Your identity metadata, usally something like this (for v2 endpoints):

   `https://login.microsoftonline.com/[your_tenant_guid]/v2.0/.well-known/openid-configuration`
2. The client id, which is found under the **Overview** Tab in the Azure console
   for your app registration.
3. The scope. It is recommended to use a custom scope. Do not use this format:
   `api://[guid]/[scope]`, just use the scope.

You should also check the manifest of your app registration. The key
`accessTokenAcceptedVersion` has to be 1 or 2, depending on your endpoint
version you use.

## HTTP In Auth Node

The HTTP node is derived from the offical [http in node][node-red-source] from
node-red. See `21-httpin.js` & `21-httpin.html`.

In addition to the normal functionality you can specify an azure-ad config node.

### Authentication

The node uses the BearerStrategy.

The following example uses [MSAL Angular][msal-angular-npmjs-url] to authenticate users:

Within your `MsalModule` registration in `app.module.ts` add your custom scope in `consentScopes`. Also add your API endpoint to the `protectedResourceMap` array.

```typescript
MsalModule.forRoot({
      auth: {
        ...environment.azureMSALConfig
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      },
    }, {
      popUp: !isIE,
      consentScopes: [
        'user.read',
        'openid',
        'profile',
        'api://[guid]/[scope]'
      ],
      unprotectedResources: [],
      protectedResourceMap: [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        ['https://[URL]/[your]/[endpoint]', ['api://[guid]/[scope]']]
      ],
      extraQueryParameters: {}
    })
```

With the HTTP interceptor you can use the HttpClient as normal.

```typescript
this.http.post('https://[URL]/[your]/[endpoint]', { test: "test" })
```

The Msal Module will automatically add the required bearer token to your request.

---

## License

[Apache 2.0](LICENSE)

[npm-version-image]: https://img.shields.io/npm/v/node-red-contrib-passport-azure-ad.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/node-red-contrib-passport-azure-ad.svg
[npm-url]: https://npmjs.org/package/node-red-contrib-passport-azure-ad
[node-image]: https://img.shields.io/node/v/node-red-contrib-passport-azure-ad.svg
[node-url]: https://nodejs.org/en/download
[passport-npmjs-url]: https://www.npmjs.com/package/passport-azure-ad
[msal-angular-npmjs-url]: https://www.npmjs.com/package/@azure/msal-angular
[node-red-source]: https://github.com/node-red/node-red/tree/889224715bf7a94d780ab84b0000db1855d78628/packages/node_modules/%40node-red/nodes/core/network