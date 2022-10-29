# The Styra Run Front-End React SDK

## Installation
```sh
npm install --save @styra/run-sdk-react
```

## Quick start
A complete example:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

import { Authz, AuthzProvider, Denied, useAuthz } from '@styra/run-sdk-react'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthzProvider path="/api/authz">
    <App/>
  </AuthzProvider>
);

const Resource = {
  CREATE: 'tickets/create/allow',
  RESOLVE: 'tickets/resolve/allow'
}

function App() {
  const { isLoading, outcomes } = useAuthz([Resource.CREATE, Resource.RESOLVE])

  if (isLoading) {
    return <div>Loading ...</div>
  }

  return (
    <div>
      <Authz query={Resource.CREATE}>
        <button authz={Denied.HIDDEN}>Create</button>
      </Authz>
      
      <Authz query={Resource.RESOLVE}>
        <button authz={Denied.DISABLED}>Resolve</button>
      </Authz>
    </div>
  )
}
```

## Components

### `<AuthzProvider/>`
Use the `AuthzProvider` component to configure your Styra Run API proxy endpoint, which enables batch query requests with caching to your application:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

import { AuthzProvider } from '@styra/run-sdk-react'

import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthzProvider path="/api/authz">
    <App/>
  </AuthzProvider>
);
```

### `<Authz/>`
Use the `Authz` component to conditionally render components based on whether the current user is allowed or denied for particular resources. Add the `authz` property to specify how to render these components, options are:

- `Denied.DISABLED` adds a `disabled` element attribute if authorization was denied
- `Denied.HIDDEN` adds a `hidden` element attribute if authorization was denied

```jsx
import React from 'react'

import { Authz, Denied } from '@styra/run-sdk-react'

export default Ticket() {
  return (
    <div>
      <Authz query="tickets/resolve/allow">
        <button authz={Denied.DISABLED}>Resolve</button>
      </Authz>

      <Authz query={['tickets/read/allow', 'tickets/create/allow']}>
        <button authz={Denied.HIDDEN}>Create</button>
      </Authz>
    </div>
  )
}
```

## Hooks

### `useAuthz`
This hook provides flexibility that requires more control over the `Authz` component. This hook provides:
- a way to preload authorization requests
- determines which authorization requests are loading
- an decision outcome object containing authorization results

`useAuthz` takes in an array of paths to query for
```jsx
import React from 'react'

import { useAuthz } from '@styra/run-sdk-react'

const Resource = {
  CREATE: 'tickets/create/allow',
  RESOLVE: 'tickets/resolve/allow'
}

export default Ticket() {
  const { isLoading, outcomes } = useAuthz([Resource.CREATE, Resource.RESOLVE])
  
  if (isLoading) {
    return null
  }
  
  return (
    <div>
      {outcomes[Resource.CREATE] && <button>Create</button>}
      <button disabled={outcomes[Resource.RESOLVE]}>Resolve</button>
    </div>
  )
}
```

