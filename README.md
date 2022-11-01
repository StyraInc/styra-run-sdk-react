# The Styra Run React SDK

## Installation
```sh
npm install --save @styra/run-sdk-react
```

## Quick start
A complete example:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

import { Authz, AuthzProvider, Denied } from '@styra/run-sdk-react'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthzProvider endpoint="/api/authz">
    <App/>
  </AuthzProvider>
);

const Resource = {
  CREATE: 'tickets/create/allow',
  RESOLVE: 'tickets/resolve/allow'
}

function App() {
  return (
    <div>
      <Authz path={Resource.CREATE}>
        <button authz={Denied.HIDDEN}>Create</button>
      </Authz>
      
      <Authz path={Resource.RESOLVE}>
        <button authz={Denied.DISABLED}>Resolve</button>
      </Authz>
    </div>
  )
}
```

## Components

### `<AuthzProvider/>`
Use the `AuthzProvider` component to configure your Styra Run API proxy endpoint, which enables batch query requests with caching to your application:

* `endpoint` specifies the API to check authorization decisions
* `defaultInput` every decision would be passed in this input unless overridden

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

import { AuthzProvider } from '@styra/run-sdk-react'

import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthzProvider endpoint="/api/authz" defaultInput={{tenant: 'acmecorp'}}>
    <App/>
  </AuthzProvider>
);
```

### `<Authz/>`
Use the `Authz` component to conditionally render components based on whether 
the current user is allowed or denied for the specified queries. Add the `authz` 
property to define how to render these components, options are:

- `Denied.DISABLED` adds a `disabled` element attribute if authorization was denied
- `Denied.HIDDEN` adds a `hidden` element attribute if authorization was denied

```jsx
import React from 'react'

import { Authz, Denied } from '@styra/run-sdk-react'

export default Ticket() {
  return (
    <div>
      <Authz path="tickets/resolve/allow" input={{id: 'ticket1234'}}>
        <button authz={Denied.DISABLED}>Resolve</button>
      </Authz>

      <Authz query={[
        {path: 'tickets/read/allow'},
        {path: 'tickets/create/allow', input={{id: 'ticket1234'}}}
      ]}>
        <button authz={Denied.HIDDEN}>Create</button>
      </Authz>
    </div>
  )
}
```

## Hooks

### `useAuthz`
This hook provides flexibility that requires more control over the `Authz` 
component. This hook provides:
- a way to preload authorization requests
- determines which authorization requests are loading
- a result array containing in order the queried decisions

`useAuthz` takes in an array of objects (path, input):
```jsx
import React from 'react'

import { useAuthz } from '@styra/run-sdk-react'

export default Ticket() {
  const { isLoading, result } = useAuthz([
    {path: 'tickets/create/allow'}, 
    {path: 'tickets/resolve/allow', input: {id: 'ticket1234'}}
  ])
  
  if (isLoading) {
    return null
  }

  const [isCreateAllowed, isResolvedAllowed] = result
  
  return (
    <div>
      {isCreateAllowed && <button>Create</button>}
      <button disabled={isResolvedAllowed}>Resolve</button>
    </div>
  )
}
```