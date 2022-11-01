import {useContext, useEffect, useMemo, useState} from "react"

import {AuthzContext, Query} from './AuthzProvider.jsx'

export default function useAuthz(pathInputs) {
  const {handleAddQuery, result} = useContext(AuthzContext)
  const [queries, setQueries] = useState(new Set())

  if (pathInputs && !Array.isArray(pathInputs)) {
    throw new Error('pathInputs is not an array')
  }

  useEffect(() => {
    if (!pathInputs) {
      return
    }

    setQueries(new Set(pathInputs.map((pathInput) => {
      if (typeof pathInput === 'string') {
        return pathInput
      }

      return Query.stringify(pathInput.path, pathInput.input)
    })))
  }, [pathInputs])

  useEffect(() => {
    queries.forEach((query) => {
      handleAddQuery(query)
    })
  }, [handleAddQuery, queries])

  return useMemo(() => {
    if (queries.size === 0) {
      return {result: [], isLoading: false}
    }

    return {
      result: [...queries].map((query) => result[query]),
      isLoading: [...queries].some((query) => !(query in result))
    }
  }, [handleAddQuery, result, queries])
}
