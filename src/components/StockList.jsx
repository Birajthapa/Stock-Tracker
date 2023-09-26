import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import { BsCaretDownFill } from "react-icons/bs"
import { BsCaretUpFill } from "react-icons/bs"
import finnHub from '../Api/finnHub';
import "../App.css"
import {useGlobalContext} from '../context/WatchListContext'
export const  StockList =()=>{
  const[stock, setStock]=useState([]);
  const {watchList,deleteStock} = useGlobalContext()
  const navigate = useNavigate()
  
  useEffect(()=>{
    let isMounted = true
    const fetchData = async ()=>{
      const responses = []
      try{
       const responses = await Promise.all(watchList.map((stocks)=>{
         return finnHub.get("/quote",{
           params:{
             symbol:stocks
           }
         })
       }))
        
        const data = responses.map((response)=>{
          return{
            data: response.data,
            symbol: response.config.params.symbol
          }
        })
        
        if(isMounted){
        setStock(data)
        }
        
      }catch(err){
        console.log(err)
      }
    }
    fetchData()
    return () =>(isMounted = false)
  },[watchList])

  const handleStockSelect=(symbol)=>{
    navigate(`detail/${symbol}`) 
  }

  function changeColor(change){
    return change > 0? 'success':'danger'
  }
  function renderIcon(change){
    return change > 0? <BsCaretUpFill/> : <BsCaretDownFill/>
  }
  return (
    <div>
    <table className="table hover mt-5">
      <thead style={{color:"rgb(79,89,102)"}}>
        <tr>
          <th scope='col'>Name</th>
          <th scope='col'>Last</th>
          <th scope='col'>Chg</th>
          <th scope='col'>Chg%</th>
          <th scope='col'>High</th>
          <th scope='col'>Low</th>
          <th scope='col'>Open</th>
          <th scope='col'>Pclose</th>
        </tr>
      </thead>
      <tbody>
        {stock.map(stockData=>{
      return <tr style={{cursor:"pointer"}} onClick={()=>handleStockSelect(stockData.symbol)} key={stockData.symbol} className="table-row" >
      <th scope="row">{stockData.symbol}</th>
        <td>{stockData.data.c}</td>
        <td className={`text-${changeColor(stockData.data.d)}`}>{stockData.data.d}{renderIcon(stockData.data.d)}</td>
        <td className={`text-${changeColor(stockData.data.dp)}`}>{stockData.data.dp}{renderIcon(stockData.data.dp)} </td>
        <td>{stockData.data.h}</td>
        <td>{stockData.data.l}</td>
        <td>{stockData.data.o}</td>
        <td>{stockData.data.pc}<button className="btn btn-sm ml-3 btn-danger d-inline-block delete-btn" onClick={(e)=>{
        e.stopPropagation()
        deleteStock(stockData.symbol)
        }}>Delete</button></td>
        
        
        </tr >
   
      
        })}
      </tbody>
    </table>
    </div>
    )
}