import { useEffect,useState } from "react"
import { useParams,Link } from "react-router-dom"
import finnHub from "../Api/finnHub"
import {StockChart} from '../components/StockChart'

const formatData=(data)=>{
  return data.t.map((el,index)=>{
    return{
      x: el*1000,
      y: Math.floor(data.c[index])  
      
    }
  })
}

export const StockDetailPage = () => {
  const [chartData, setChartData]= useState([]);
  const { symbol } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const date = new Date();
      const currentTime = Math.floor(date.getTime() / 1000)
      let oneDay;
      if(date.getDay()===6){
       oneDay = currentTime - 2*60 * 60 * 24
      } else if(date.getDay()===0){
       oneDay = currentTime - 3*60 * 60 * 24
      }else{
       oneDay = currentTime - 60 * 60 * 24
      }
      const oneWeek = currentTime - 7*60*60*24
      const oneYear = currentTime - 365*60*60*24
      try{
      const responses = await Promise.all([
        finnHub.get("/stock/candle", {
        params: {
          symbol,
          from: oneDay,
          to: currentTime,
          resolution: 30,
        }
      }), finnHub.get("/stock/candle", {
        params: {
          symbol,
          from: oneWeek,
          to: currentTime,
          resolution: 60,
        }
      }), finnHub.get("/stock/candle", {
        params: {
          symbol,
          from: oneYear,
          to: currentTime,
          resolution: "W",
        }
      })
      ])
      console.log(responses);
        setChartData({
        day:formatData(responses[0].data),
        week:formatData(responses[1].data),
        year:formatData(responses[2].data) 
      })
        
      } catch(err){
        console.log(err)
      }
    }
    fetchData()
  }, [symbol])
  return <div>
    {chartData && (
    <div>
      <Link className="btn btn-primary mt-4" to='/'>Back Home</Link>
      <StockChart chartData={chartData} symbol={symbol} />
    </div>
    )}
  </div>
}