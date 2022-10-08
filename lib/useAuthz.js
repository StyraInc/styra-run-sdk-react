import {useContext, useEffect, useMemo, useState} from "react"

import {Context} from './AuthzProvider.jsx'

export default function useAuthz(paths) {
  const {handleAddQuery, outcomes} = useContext(Context)
  const [queries, setQueries] = useState(new Set())

  if (paths && !Array.isArray(paths)) {
    throw new Error('paths is not an array')
  }

  useEffect(() => {
    if (!paths) {
      return
    }

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
    if ((paths ?? []).length === 0) {
      return {outcomes}
    }

    return {
      outcomes: paths.reduce((paths, path) => {
        paths[path] = outcomes[path]
        return paths
      }, {}),
      isLoading: paths.some((path) => !(path in outcomes))
    }
  }, [handleAddQuery, outcomes, paths])
}
