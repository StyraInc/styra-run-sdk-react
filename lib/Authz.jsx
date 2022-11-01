import PropTypes from 'prop-types'
import React, {useMemo} from 'react'

import useAuthz from './useAuthz'

export const Denied = {
  DISABLED: 'deny-disabled',
  HIDDEN: 'deny-hidden'
}

export default function Authz({path, input, query, children}) {
  const queries = useMemo(() => {
    const queries = [...query ?? []]

    if (path) {
      queries.unshift(input ? {path, input} : {path})
    }

    return queries
  }, [path, input, query])

  const {result} = useAuthz(queries)

  const allowed = useMemo(() => (
    result ? result.every((decision) => decision === true) : null
  ), [result])

  return children
    ? renderChildren(children, allowed)
    : null
}

Authz.propTypes = {
  path: PropTypes.string.isRequired,
  input: PropTypes.object,
  query: PropTypes.array,
  children: PropTypes.node.isRequired
}

function renderChildren(children, allowed) {
  return React.Children.map(children, (child) => {
    if (!child?.props) {
      return child
    }

    const props = {...child.props}

    if (props.children) {
      props.children = renderChildren(props.children, allowed)
    }

    switch (!allowed ? props.authz : null) {
      case Denied.HIDDEN: {
        props.hidden = true
        break
      }

      case Denied.DISABLED: {
        props.disabled = true
        break
      }
    }

    return React.cloneElement(child, props)
  })
}