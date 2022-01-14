import axios from 'axios'
import { useEffect, useState } from 'react'

export default function useSneakerSearch(query, pageNumber) {
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(false)
   const [sneakers, setSneakers] = useState([])
   const [hasMore, setHasMore] = useState(false)

   useEffect(()=>{
      setSneakers([])
   },[query])

   useEffect(() => {
      setLoading(true)
      setError(false)
      let cancel
      axios({
         method: 'GET',
         url: 'https://the-sneaker-database.p.rapidapi.com/search',
         params: { limit: '100', page: pageNumber, query: query },
         headers: {
            'x-rapidapi-host': 'the-sneaker-database.p.rapidapi.com',
            'x-rapidapi-key': '166a2fc4f4msh857d9abf58f768dp17ec6fjsne68af9bfae95'
         },
         cancelToken: new axios.CancelToken(c => cancel = c)
      }).then(res => {
         setSneakers(prevSneakers => {
            return [...new Set([...prevSneakers,...res.data.results.map(sneaker => sneaker.name)])]
         })
         setHasMore(res.data.results.length > 0)
         setLoading(false)
         console.log(res.data)
      }).catch( e => {
         if(axios.isCancel(e)) return
         setError(true)
         console.log(e)
      })
      return () => cancel()
   }, [query, pageNumber])

   return {loading, error, sneakers, hasMore}
}
