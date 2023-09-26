import { createContext, useContext,useState } from "react";

const WatchListContext = createContext()


 const WatchListContextProvider= ({children}) => {
   const[watchList,setWatchList]=useState(["GOOGL","AAPL","MSFT",'TSLA']);

   const addStock=(stock)=>{
     if(watchList.indexOf(stock) === -1){
     setWatchList([...watchList,stock])
     }
   }
   const deleteStock=(stock)=>{
     setWatchList(watchList.filter((el)=>{
       return el !== stock
     }))
   }
   
  return(
   <WatchListContext.Provider value={{watchList,addStock,deleteStock}}>
   {children}
   </WatchListContext.Provider>
  )
}


 export const useGlobalContext = ()=>{
   return useContext(WatchListContext)
  }

export{WatchListContext,WatchListContextProvider}
