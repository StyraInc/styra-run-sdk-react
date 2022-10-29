import PropTypes from 'prop-types'
import React, {useContext, useEffect, useMemo} from 'react'

import {Context} from './AuthzProvider.jsx'

export const Denied = {
  DISABLED: 'deny-disabled',
  HIDDEN: 'deny-hidden'
}

export default function Authz({query, children}) {
  const {handleAddQuery, outcomes} = useContext(Context)

  const allowed = useMemo(() => {
    if (typeof query === 'string') {
      return outcomes[query]
    }
    
    return query.every((x) => outcomes[x])
  }, [outcomes])

  useEffect(() => {
    handleAddQuery(query)
  }, [handleAddQuery, query])

  return children
    ? renderChildren(children, allowed)
    : null
}

Authz.propTypes = {
  query: PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.array
  ]).isRequired,
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