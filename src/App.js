import './App.css';
import { useState, useRef, useCallback } from 'react'
import useSneakerSearch from './hooks/useSneakerSearch';

function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const { loading, error, sneakers, hasMore } = useSneakerSearch(query, pageNumber)

  const observer = useRef()
  const lastSneakerRef = useCallback((node) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const handleSearch = (e) => {
    setQuery(e.target.value)
    setPageNumber(1)
  }
  return (
    <div className="App">
      <div>
        <label>search sneakers...</label> <br />
        <input
          type='text'
          onChange={handleSearch}
          value={query}
          placeholder='yeezy'
        />
      </div>
      {sneakers.map((sneaker, index) => {
        if (sneakers.length === index + 1) {
          return <pre ref={lastSneakerRef} key={sneaker}>{sneaker}</pre>
        }
        else {
          return <pre key={sneaker}>{sneaker}</pre>
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </div>
  );
}

export default App;
