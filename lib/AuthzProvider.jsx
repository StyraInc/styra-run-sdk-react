import PropTypes from 'prop-types'
import React, {useCallback, useEffect, useMemo, useState} from 'react'

export const Context = React.createContext()

export default function AuthzProvider({children, path}) {
  const [queries, setQueries] = useState(new Set())
  const [outcomes, setOutcomes] = useState({})

  const handleAddQuery = useCallback((query) => {
    setQueries((queries) => {
      const mergedQueries = new Set([
        ...queries,
        ...(typeof query === 'string' ? [query] : query)
      ])

      if (mergedQueries.size === queries.size) {
        return queries
      }
      
      return mergedQueries
    })
  }, [setQueries])

  const value = useMemo(() => (
    {outcomes, handleAddQuery}
  ), [outcomes, handleAddQuery])

  useEffect(() => {
    if (queries.size === 0) {
      return
    }

    // debounce authz API request
    const timeout = setTimeout(() => {
      const paths = [...queries].map((path) => ({path}))
      setQueries(new Set())

      fetch(path, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({items: paths})
      })
        .then((res) => res.json())
        .then((data) => {
          setOutcomes((outcomes) => {
            return data.result.reduce((outcomes, {result}, index) => {
              const {path} = paths[index]
              outcomes[path] = result ?? false
              return outcomes
            }, {...outcomes})
          })
        })
    }, 0)

    return () => clearTimeout(timeout)
  }, [queries])

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

AuthzProvider.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired
}