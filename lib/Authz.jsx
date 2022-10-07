import PropTypes from 'prop-types'
import React, {useContext, useEffect, useMemo} from 'react'

import {Context} from './AuthzProvider.jsx'

export const Denied = {
  DISABLED: 'deny-disabled',
  HIDDEN: 'deny-hidden'
}

export default function Authz({path, children}) {
  const {handleAddQuery, outcomes} = useContext(Context)

  const allowed = useMemo(() => {
    return outcomes[path]
  }, [outcomes])

  useEffect(() => {
    handleAddQuery(path)
  }, [handleAddQuery, path])

  return children
    ? renderChildren(children, allowed)
    : null
}

Authz.propTypes = {
  path: PropTypes.string.isRequired,
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