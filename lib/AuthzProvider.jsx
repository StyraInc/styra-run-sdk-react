import PropTypes from 'prop-types'
import React, {useCallback, useEffect, useMemo, useState} from 'react'

export const AuthzContext = React.createContext()

export const Query = {
  stringify: (path, input) => {
    const params = new URLSearchParams(Object.entries(input ?? {}).sort())
    return input ? `${path}?${params}`: path
  },
  parse: (query) => {
    const [path, ...queryParams] = query.split('?')
    const params = queryParams.join('?')
    if (!params) {
      return {path}
    }
  
    const searchParams = new URLSearchParams(params)
    const input = Object.fromEntries(searchParams.entries())
    return {path, input}
  }
}

export default function AuthzProvider({children, endpoint, defaultInput}) {
  const [queries, setQueries] = useState(new Set())
  const [result, setResult] = useState({})

  const handleAddQuery = useCallback((path, input) => {
    setQueries((queries) => {
      const mergedQueries = new Set([...queries, Query.stringify(path, input)])

      if (mergedQueries.size === queries.size) {
        return queries
      }
      
      return mergedQueries
    })
  }, [setQueries])

  const value = useMemo(() => (
    {result, handleAddQuery}
  ), [result, handleAddQuery])

  useEffect(() => {
    if (queries.size === 0) {
      return
    }

    // debounce authz API request
    const timeout = setTimeout(() => {
      const items = [...queries].map((query) => {
        const {path, input} = Query.parse(query)
        const item = {path}

        if (input || defaultInput) {
          item.input = {...defaultInput, ...input}
        } 

        return item
      })

      setQueries(new Set())

      fetch(endpoint, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({items})
      })
        .then((res) => res.json())
        .then((data) => {
          setResult((prevResult) => {
            return data.result.reduce((result, data, index) => {
              const {path, input} = items[index]
              result[Query.stringify(path, input)] = data.result ?? false
              return result
            }, {...prevResult})
          })
        })
    }, 0)

    return () => clearTimeout(timeout)
  }, [queries, defaultInput])

  return (
    <AuthzContext.Provider value={value}>
      {children}
    </AuthzContext.Provider>
  )
}

AuthzProvider.propTypes = {
  children: PropTypes.node.isRequired,
  endpoint: PropTypes.string.isRequired,
  defaultInput: PropTypes.object
}