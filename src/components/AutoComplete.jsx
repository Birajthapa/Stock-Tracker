import {useState, useEffect} from 'react';
import finnHub from "../Api/finnHub"
import {useGlobalContext} from '../context/WatchListContext'

export const AutoComplete=()=>{
  const {addStock,deleteStock} =useGlobalContext()
  const [search, setSearch]=useState("")
  const [results, setResults]=useState([]);

  const renderDropdown=()=>{
    const dropDownClass = search ? 'show': null
    return (
      <ul style={{
        height:'500px',
        overflowY:'scroll',
        overflowX:'hidden',
        cursor:'pointer'
      }} className={`dropdown-menu ${dropDownClass}`}>
        {results.map((result)=>{
        return(
          <li key={result.symbol} className='dropdown-item'onClick={()=>{
            addStock(result.symbol)
            setSearch('')
          }}>{result.description} ({result.symbol})</li>
        )
        })}
        
      </ul>
    )
  }

  useEffect(()=>{
    let isMounted = true
    const fetchData=async()=>{
      try{
        const response = await finnHub.get("/search",{
          params:{
            q:search
          }
        })
        console.log(response)
        if(isMounted){
        setResults(response.data.result)
        }
      }catch(err){
        
      }
    }
    if(search.length > 0){
    fetchData()
    } else{
      setResults([])
    }
    return ()=> (isMounted=false)
  },[search])

  
  return <div className='w-50 p-5 rounded mx-auto'>
    <div className="form-floating dropdown">
      <input id='search' style={{backgroundColor:'rgba(145,158,171,0.04)'}} type='text' className='form-control' placeholder='Search' value={search} onChange={(e)=>{setSearch(e.target.value)}} autoComplete='off'></input>
      <label htmlFor='search'>Search</label>
      {renderDropdown()}
  </div>
  </div>
}