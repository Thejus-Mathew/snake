import { useEffect, useRef, useState } from 'react'
import './App.css'
import headImg from './assets/snakeHead.png'
import headImg2 from './assets/snakeHead2.png'
import headImg3 from './assets/snakeHead3.png'
import headImg4 from './assets/snakeHead4.png'
import blood from './assets/blood.png'
import frog from './assets/frog.png'

function App() {

  const width = 30
  let border = []
  for(let i =0;i<width;i++){
    border.push(i)
    border.push((width*(width-1))+i)
    border.push((i*width))
    border.push((i*width)+(width-1))
  }

  let dummySquare = []
  for(let i=1;i<=(width*width);i++){
    dummySquare.push({snakeHead:false,snakeBody:false,border:false,index:(i-1),frog:false})
  }
  dummySquare = dummySquare.map((item,index)=>(
    border.includes(index)?{...item,border:true}:{...item}
  ))
  dummySquare[435]={...dummySquare[435],snakeHead:true}
  dummySquare[434]={...dummySquare[434],snakeBody:true}
  dummySquare[433]={...dummySquare[433],snakeBody:true}
  dummySquare[432]={...dummySquare[432],snakeBody:true}
  let dummySquare1 = dummySquare.filter(item=>!item.snakeHead && !item.border && !item.snakeBody)
  let key = dummySquare1[Math.floor(Math.random()*dummySquare1.length)].index
  dummySquare[key] = {...dummySquare[key],frog:true}
  const[body,setBody] = useState([434,433,432])
  const[square,setSquare]=useState(dummySquare)
  const[dir,setDir]=useState(1)
  const [intervalId, setIntervalId] = useState(null);
  const[dead,setDead]=useState(false)
  const[score,setScore]=useState(0)
  const inputRef = useRef(null);
  const[hs,setHS]=useState(0)
  const[time,setTime]=useState(200)



  const startInterval = (dire) => {
    if (!intervalId) {
      const id = setInterval(() => {
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
          let frogkey = newData.find(item=>item.frog).index
          let headKey = newData.find(item=>item.snakeHead).index
          let key
          if(frogkey==headKey) {
            key = body[body.length-1]
          }

          for(let i =(body.length-1);i>-1;i--){
            
            if(i==0){
              body[i]=index
            }else{
              body[i]=body[i-1]
            }
          }

          if(frogkey==headKey) {
            body.push(key)
          }
          newData = newData.map(item=>({...item,snakeBody:false}))
          for(let i = 0;i<body.length;i++){
            newData[body[i]]= {...newData[body[i]],snakeBody:true}
          }
          return newData
      })
      

      }, time);
      setIntervalId(id);
    }
  };


  const stopInterval = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };


useEffect(()=>{
  startInterval(dir)
}
,[dir])

useEffect(()=>{
  let square2 = square.filter(item=>item.border || item.snakeBody)
  if(square2.find(item=>item.snakeHead)){
    stopInterval()
    setDead(true)
  }
  let frogkey = square.find(item=>item.frog).index
  let headKey = square.find(item=>item.snakeHead).index
  if(frogkey==headKey) {
    setScore((previousData)=>{
      let newData = previousData+1
      return newData
    })
    if(time != 50){
      setTime((data)=>(data-12.5))
    }
    setSquare((previousData)=>{
      let newData = [...previousData]
      newData[frogkey] = {...newData[frogkey],frog:false}
      let dummyNewData = newData.filter(item=>!item.snakeHead && !item.border && !item.snakeBody)
      let key = dummyNewData[Math.floor(Math.random()*dummySquare1.length)].index
      newData[key] = {...newData[key],frog:true}
      return newData
    })
  }
  if(deviceType=='desktop'){
    inputRef.current.focus();
  }

}
,[square])


const changeDir=(i)=>{
  if(!dead){
    if((dir != i) && (dir + i != 0)){
      stopInterval()
      setDir(i)
    }
  }
}

const restart = ()=>{
    setSquare(()=>{
      let border = []
  for(let i =0;i<width;i++){
    border.push(i)
    border.push((width*(width-1))+i)
    border.push((i*width))
    border.push((i*width)+(width-1))
  }

  let dummySquare = []
  for(let i=1;i<=(width*width);i++){
    dummySquare.push({snakeHead:false,snakeBody:false,border:false,index:(i-1),frog:false})
  }
  dummySquare = dummySquare.map((item,index)=>(
    border.includes(index)?{...item,border:true}:{...item}
  ))
  dummySquare[435]={...dummySquare[435],snakeHead:true}
  dummySquare[434]={...dummySquare[434],snakeBody:true}
  dummySquare[433]={...dummySquare[433],snakeBody:true}
  dummySquare[432]={...dummySquare[432],snakeBody:true}
  let dummySquare1 = dummySquare.filter(item=>!item.snakeHead && !item.border && !item.snakeBody)
  let key = dummySquare1[Math.floor(Math.random()*dummySquare1.length)].index
  dummySquare[key] = {...dummySquare[key],frog:true}
  return dummySquare
    })
    setTime(200)
    setDir(1)
    setBody([434,433,432])
    setDead(false)
    setScore(0)
    startInterval(1)
    if(score>hs){
      setHS(score)
      localStorage.setItem("hs",score)
    }
}

const handleKeyDown = (event) => {
  if (event.key === 'ArrowUp'|| event.key === 'w') {
    changeDir(2)
  }else if(event.key === 'ArrowDown' || event.key === 's'){
    changeDir(-2)
  }
  else if(event.key === 'ArrowLeft'|| event.key === 'a'){
    changeDir(-1)
  }
  else if(event.key === 'ArrowRight'|| event.key === 'd'){
    changeDir(1)
  }
}



const [deviceType, setDeviceType] = useState('tablet');

const getDeviceType = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 1024) {
    setDeviceType('tablet');
  } else {
    setDeviceType('desktop');
  }
};
useEffect(()=>{
  getDeviceType()
  if(localStorage.getItem('hs')){
    setHS(localStorage.getItem("hs"))
  }
},[])
  
  return (
    <>
      <div className="main d-flex justify-content-center align-items-center gap-5 position-relative" style={{width:"100%",height:"100vh"}}>
        <input style={{opacity:"0",width:'0',height:"0",position:"absolute"}} type="text" onKeyDown={handleKeyDown} ref={inputRef}/>
        {
          dead?<div className='restart position-absolute text-center text-light p-3 rounded shadow-lg'>
                  <h2>Your Score: {score}</h2>
                  <button className='btn btn-light' onClick={restart}>restart</button>
              </div>:<></>
        }
        <div className="square bg-dark d-flex flex-wrap">
          {
            square.map((item,index)=>(
              <div key={index} className={`cell text-light d-flex justify-content-center align-items-center position-relative ${(item.border)?"bg-secondary":"bg-success"}`} style={{width:`${100/width}%`,height:`${100/width}%`}}>
                {item.snakeHead?<img src={dir==1?headImg:dir==-1?headImg2:dir==2?headImg3:headImg4} width={"100%"} height={"100%"} alt="" />:<></>}
                {item.snakeBody?<div className='snakeBody'></div>:<></>}
                {dead && item.snakeHead?<img className='position-absolute' src={blood} width={"100%"} height={"100%"}/>:<></>}
                {item.frog?<img src={frog} width={"100%"} height={"100%"}/>:<></>}
                {(item?.index==width-2)?<div className='position-absolute'>{score}</div>:<></>}
                {(item?.index==width-3)?<div className='position-absolute'>:</div>:<></>}
                {(item?.index==width-4)?<div className='position-absolute'>E</div>:<></>}
                {(item?.index==width-5)?<div className='position-absolute'>R</div>:<></>}
                {(item?.index==width-6)?<div className='position-absolute'>O</div>:<></>}
                {(item?.index==width-7)?<div className='position-absolute'>C</div>:<></>}
                {(item?.index==width-8)?<div className='position-absolute'>S</div>:<></>}
                {(item?.index==1)?<div className='position-absolute'>H</div>:<></>}
                {(item?.index==2)?<div className='position-absolute'>S</div>:<></>}
                {(item?.index==3)?<div className='position-absolute'>:</div>:<></>}
                {(item?.index==4)?<div className='position-absolute'>{hs}</div>:<></>}
              </div>
            ))
          }
        </div>
        {
          deviceType=='tablet'?
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
        </div>:<></>
        }
      </div>
    </>
  )
}

export default App