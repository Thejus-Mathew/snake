import { useEffect, useState } from 'react'
import './App.css'
import headImg from './assets/snakeHead.png'
import headImg2 from './assets/snakeHead2.png'
import headImg3 from './assets/snakeHead3.png'
import headImg4 from './assets/snakeHead4.png'
import blood from './assets/blood.png'

function App() {

  const width = 30
  const border = []
  for(let i =0;i<width;i++){
    border.push(i)
    border.push((width*(width-1))+i)
    border.push((i*width))
    border.push((i*width)+(width-1))
  }

  let dummySquare = []
  for(let i=1;i<=(width*width);i++){
    dummySquare.push({snakeHead:false,food:false,snakeBody:false,border:false,index:(i-1)})
  }
  dummySquare = dummySquare.map((item,index)=>(
    border.includes(index)?{...item,border:true}:{...item}
  ))
  dummySquare[435]={...dummySquare[435],snakeHead:true}

  const[square,setSquare]=useState(dummySquare)
  const[dir,setDir]=useState(1)
  const [intervalId, setIntervalId] = useState(null);
  const[dead,setDead]=useState(false)



  const startInterval = (dire) => {
    if (!intervalId) {
      const id = setInterval(() => {
        setDead(false)
        setSquare((previousData)=>{
          let index = previousData.find(item=>item.snakeHead).index
          let newData = [...previousData]
          let newIndex
    
          newIndex = dire==1?index+1:
                    dire==-1?index-1:
                    dire==2?index-width:
                    dire==-2?index+width:null
    
          newData[index]={...newData[index],snakeHead:false}
          newData[newIndex]={...newData[newIndex],snakeHead:true}
          return newData
      })

      }, 400);
      setIntervalId(id);
    }
  };


  const stopInterval = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };


useEffect(()=>{
  startInterval(dir)
},[dir])

useEffect(()=>{
  let square2 = square.filter(item=>item.border)
  if(square2.find(item=>item.snakeHead)){
    stopInterval()
    setDead(true)
  }
},[square])


const changeDir=(i)=>{
  if((dir != i) && (dir + i != 0)){
    stopInterval()
    setDir(i)
  }
}


  
  return (
    <>
      <div className="main d-flex justify-content-center align-items-center gap-5" style={{width:"100%",height:"100vh"}}>
        <div className="square bg-dark d-flex flex-wrap">
          {
            square.map((item,index)=>(
              <div key={index} className={`cell d-flex justify-content-center align-items-center position-relative ${(item.border)?"bg-secondary":"bg-success"}`} style={{width:`${100/width}%`,height:`${100/width}%`}}>
                {item.snakeHead?<img src={dir==1?headImg:dir==-1?headImg2:dir==2?headImg3:headImg4} width={"100%"} height={"100%"} alt="" />:<></>}
                {item.snakeBody?<div className='snakeBody'></div>:<></>}
                {dead && item.snakeHead?<img className='position-absolute' src={blood} width={"100%"} height={"100%"}/>:<></>}
              </div>
            ))
          }
        </div>
        <div className="control bg-secondary d-flex flex-wrap border border-3 position-relative justify-content-center align-items-center">
          <div className="button w-50 border border-3 d-flex justify-content-center align-items-center" style={{aspectRatio:"1/1"}}>
            <button onClick={()=>changeDir(2)}><i className="fa-solid fa-caret-right fa-rotate-by fa-xl" style={{ "--fa-rotate-angle": "-135deg" }}></i></button>
          </div>
          <div className="button w-50 border border-3 d-flex justify-content-center align-items-center" style={{aspectRatio:"1/1"}}>
            <button onClick={()=>changeDir(1)}><i className="fa-solid fa-caret-right fa-rotate-by fa-xl" style={{ "--fa-rotate-angle": "-45deg" }}></i></button>
          </div>
          <div className="button w-50 border border-3 d-flex justify-content-center align-items-center" style={{aspectRatio:"1/1"}}>
            <button onClick={()=>changeDir(-1)}><i className="fa-solid fa-caret-right fa-rotate-by fa-xl" style={{ "--fa-rotate-angle": "135deg" }}></i></button>
          </div>
          <div className="button w-50 border border-3 d-flex justify-content-center align-items-center" style={{aspectRatio:"1/1"}}>
            <button onClick={()=>changeDir(-2)}><i className="fa-solid fa-caret-right fa-rotate-by fa-xl" style={{ "--fa-rotate-angle": "45deg" }}></i></button>
          </div>
          <div className="circle position-absolute text-info bg-light"></div>
        </div>
      </div>
    </>
  )
}

export default App
