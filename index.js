const core = require('@actions/core');
const github = require('@actions/github');

// try {
//   // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput('who-to-greet');
//   console.log(`Hello ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
// } catch (error) {
//   core.setFailed(error.message);
// }


const fs = require('fs')
const fetch = require('node-fetch');
const wasm_avif = require('@saschazar/wasm-avif');   
// const wasm_mozjpeg = require('@saschazar/wasm-mozjpeg');
const wasm_image_loader = require('@saschazar/wasm-image-loader');

// const jpegdefaultOptions = require('@saschazar/wasm-mozjpeg/options'); // fully populated options object crucially needed!
const avifDefaultOptions  = require( '@saschazar/wasm-avif/options');


// const fetchImage = async () => new Uint8Array(await fetch(SAMPLE_URL).then(res => res.buffer()));


// (async function(){
//   let info = await fetch("http://127.0.0.1:2020/task").then(res=>res.json())
//   var { imagePath } = info
//   var imageUrl = `http://127.0.0.1:2020${imagePath}`
//   const fetchImage =  async () => new Uint8Array(await fetch(imageUrl).then(res => res.buffer()));
//   let imageData = await fetchImage()
//   console.log(imageData)
// })()
   

const remoteUrl = "http://202.182.114.185:2020"
// const remoteUrl = "http://127.0.0.1:2020"


var time 
var count = 0
time = setInterval(()=>{
  fetch(`${remoteUrl}/progress?progress=${count}`)
count += 1
if (count > 10){
  clearInterval(time)
}
},1500)





const loadNetJpeg = async () => {
  let info = await fetch(`${remoteUrl}/task`).then(res=>res.json())
  var { imagePath } = info
  var imageUrl = `${remoteUrl}${imagePath}`
  console.log(imageUrl)
  const fetchImage =  async () => new Uint8Array(await fetch(imageUrl).then(res => res.buffer()));
  let imageData = await fetchImage()
  console.log(imageData.length)
  return imageData
}



// const options = {
//     ...avifDefaultOptions, // MozJPEG's options
//     in_color_space: 9, // let encoder know, that we're dealing with RGBA input buffer
// };


// const loadJpegFile = async () => {
//     let fileName = "avif-test-1920.jpg"
//     let filePath = `${__dirname}/${fileName}`
//     console.log(filePath )
//     if (fs.existsSync(filePath)){
//          let file = fs.readFileSync(filePath) 
//          return new Uint8Array(file)
//     }
// }


async function postData(data){
  let option =  {
    method: 'post',
    headers: {
      "Content-length": data.length
   },
    body: data
  }
  let t =  await fetch(`${remoteUrl}/complete` , option ).then(res=>res.text())
}


//  Promise.all([ loadJpegFile() , wasm_image_loader() , wasm_avif() ])
// Promise.all([ loadNetJpeg() , wasm_image_loader() , wasm_avif() ])
// .then(([buffer, imageLoader, avif ]) => {
//     const rawRBG = imageLoader.decode(buffer, buffer.length, 3)
//     const { height, width } = imageLoader.dimensions()
//     console.log(avifDefaultOptions)
//     var avifBuffer = avif.encode( rawRBG, width, height, 3 , avifDefaultOptions , 1 )
//     // fs.writeFileSync(`${__dirname}/test-output.avif` , avifBuffer )
//     console.log(avifBuffer)
//     console.log(avifBuffer.length)
//     postData(avifBuffer)
//     imageLoader.free()
//     avif.free()
// })
