import {useContext, useEffect, useMemo, useState} from "react"

import {Context} from './AuthzProvider.jsx'

export default function useAuthz(paths) {
  const {handleAddQuery, outcomes} = useContext(Context)
  const [queries, setQueries] = useState(new Set())

  if (paths && !Array.isArray(paths)) {
    throw new Error('paths is not an array')
  }

  useEffect(() => {
    setQueries((queries) => {
      if (paths.every((path) => queries.has(path))) {
        return queries
      }

      return new Set(paths)
    })
  }, [paths])

  useEffect(() => {
    queries.forEach((query) => {
      handleAddQuery(query)
    })
  }, [handleAddQuery, queries])

  return useMemo(() => {
    return {
      outcomes,
      isLoading: paths?.some((path) => !(path in outcomes))
    }
  }, [handleAddQuery, outcomes, paths])
}