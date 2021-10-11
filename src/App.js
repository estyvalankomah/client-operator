import { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import { processor } from "./frames";
import { drawRect } from './utilities';
import './App.css';


function App() {

    const canvasRef = useRef(null);
    const runModel = async()=>{
    const net = await tf.loadGraphModel('https://tensorflow-js-model-by-mmra.s3.eu-de.cloud-object-storage.appdomain.cloud/model.json')

    setInterval(()=>{
        detect(net);
        }, 16.7)
    }

  const detect = async(net) =>{
    const ctx = document.querySelector("canvas").getContext("2d")
    let canvasData = ctx.getImageData(0,0,500,450)

    const img = tf.browser.fromPixels(canvasData)
    const resized = tf.image.resizeBilinear(img, [500,480])
    const casted = resized.cast('int32')
    const expanded = casted.expandDims(0)
    const obj = await net.executeAsync(expanded) 
    console.log(obj)

    const boxes = await obj[1].array()
    const classes = await obj[2].array()
    const scores = await obj[4].array()
    
    // Draw bbox
    requestAnimationFrame(() =>{
        drawRect(boxes[0], classes[0], scores[0], 0.3, 500, 450, ctx)
    })

    tf.dispose(img)
    tf.dispose(resized)
    tf.dispose(casted)
    tf.dispose(expanded)
    tf.dispose(obj)
  }

  // useEffect(() => {
  //   fetch("http://localhost:5000/video_feed").then(response =>
  //     response.json().then(data => {
  //       let flattened = [].concat(...data[0])
  //       setData(flattened)
  //       drawImage(flattened)
  //     }));
  //   });


  useEffect(() => {
    setTimeout(function () {
        processor.doLoad()
    }, 16.7);
    runModel()
    
    // let output = getFrame()
    // console.log(output);
    // setTimeout(function () {
    //     processor.doLoad()
    // }, 16.7);
  })

  return (
    <div className="App">
      <div id="top-bar">
          <h1>ELECTRONIC GATE: MAIN GATE</h1>
       </div>
       <div id="lower-container">
          <div id="video-container">
              <h3>Video Feed</h3>
              <div id="video-div">
                  <video width = "500" height="450" autoPlay muted>
                    <source src="/Videos/Egate_vidoe_feed.mp4" type="video/mp4"/>
                  </video>
              </div>
              <canvas ref={canvasRef} width="500" height="450"></canvas>
          </div>
          <div id="results-container">
              <div id="results-top">
                  <div id="top-right">
                    <p><b>Booth Name: Booth A</b></p>
                    <p><b>Attendant Name: Kofi Badu</b></p>
                    <p><b>Car count: 86</b></p>
                  </div>
              </div>
              <div id="results-bottom">
                  <h3>Detected Plate</h3>
                  <div id="mini-container">
                      <div id="plate-container">
                          <div id="plate"></div> 
                      </div>
                      <div id="search-container">
                          <small>Extracted wrong registration number?</small>
                          <form action="">
                              <input type="text" placeholder="Search for right registration number" name="search"/>
                              <button>Search</button>
                          </form>
                      </div>
                  </div>
                  <div id="results">
                      <table>
                          <tr>
                              <td><b>Name</b></td>
                              <td></td>
                          </tr>
                          <tr>
                              <td><b>Status</b></td>
                              <td></td>
                          </tr>
                          <tr>
                              <td><b>Registration Number</b></td>
                              <td></td>
                          </tr>
                          <tr>
                              <td><b>Expiry Date</b></td>
                              <td></td>
                          </tr>
                      </table>
                  </div>
              </div>
          </div>
       </div>
    </div>
  );
}

export default App;
