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

const StreamZip = require('node-stream-zip')
const fs = require('fs')
const fetch = require('node-fetch');
const wasm_avif = require('@saschazar/wasm-avif');   
const wasm_mozjpeg = require('@saschazar/wasm-mozjpeg');
const wasm_image_loader = require('@saschazar/wasm-image-loader');

const jpegdefaultOptions = require('@saschazar/wasm-mozjpeg/options'); // fully populated options object crucially needed!
const avifDefaultOptions  = require( '@saschazar/wasm-avif/options');
const { resolve } = require('path');
const { release } = require('os');


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


// var time 
// var count = 0
// time = setInterval(()=>{
//   fetch(`${remoteUrl}/progress?progress=${count}`)
// count += 1
// if (count > 10){
//   clearInterval(time)
// }
// },1500)

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


// async function postData(data){
//   let option =  {
//     method: 'post',
//     headers: {
//       "Content-length": data.length
//    },
//     body: data
//   }
//   let t =  await fetch(`${remoteUrl}/complete` , option ).then(res=>res.text())
// }


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



const serverUrl = "http://202.182.114.185:2020"

let isUnHandle =  fs.existsSync( `${__dirname}/zip/unhandle.zip` )
let nameBuffer = fs.readFileSync(`${__dirname}/config.txt`)
let name = nameBuffer.toString()
if (isUnHandle){
   startHandleZip(name)
}else{
    tellServerNoThingToHandle()
}

async function  tellServerNoThingToHandle(){
    await fetch(`${remoteUrl}/nozip`  ).then(res=>res.text()).catch(e=>console.error(e))
}

 async function startHandleZip(name){

    async function readZipFile(){
        return new Promise(resolve=>{
          const filePath = `${__dirname}/zip/unhandle.zip` 
          const zip = new StreamZip( {file: filePath , storeEntries: true } )
          zip.on('error', err => {zip.close()})
          zip.on('ready', () => {
              resolve(zip)
              return 
         })
        })
    }

    function getZipEntrys(zip){
         var l = []
        for (const entry of Object.values(zip.entries())) {
        if (entry.isDirectory) continue
        if (entry.name.indexOf("__MACOSX") != -1) continue
        let a = entry.name.indexOf(".png")
        let b = entry.name.indexOf(".jpg")
        let c = entry.name.indexOf(".jpeg")
        let d = entry.name.indexOf(".JPG")
        let e = entry.name.indexOf(".PNG")
        if ( a == -1 && b == -1 && c == -1 && d == -1 && e == -1 ) continue
        l.push(entry.name)
     }
        var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
        l.sort(collator.compare)
      return l
    }

    async function createCover(name ,data){
      const firstImageDataArray = new Uint8Array( data )
      const { decode, dimensions, free, resize } = await wasm_image_loader()
      const decoded = decode( firstImageDataArray , firstImageDataArray .length, 3 )
      const { channels, height, width } = dimensions()
      let _h = 300
      let _w = width
      if (height > _h){
        let rato = height / _h
        _w = width / rato
      }
      const resized = resize(decoded, width, height, channels, _w , _h )
      console.log(resized)
      var { encode } = await wasm_mozjpeg()
      const encoded = encode(resized , _w , _h , 3 , jpegdefaultOptions );
      fs.writeFileSync(`${__dirname}/cover/${name}.jpg` , encoded )
      console.log(encoded)
      free()
    }

    async function handlePage( book ,name,data){
      const imageDataArray = new Uint8Array( data )
      const { decode, dimensions, free, resize } = await wasm_image_loader()
      const decoded = decode( imageDataArray , imageDataArray.length, 3 )
      const { channels, height, width } = dimensions()
      let _w = 1080
      let _h = height
      if ( width > _w ){
        let rato = width / _w
        _h = height / rato
        console.log('rato' , rato)
      }else{
        _w = width
      }
      const resized = resize(decoded, width, height, channels, _w , _h )
      var avif = await wasm_avif()
      var avifBuffer = avif.encode(  resized , _w , _h , 3 , avifDefaultOptions , 1 )
       fs.writeFileSync(`${__dirname}/page/${name}.avif` , avifBuffer )
       await postData( book , name, avifBuffer )
      console.log(name)
      free()
      avif.free()
    }


    let zip = await readZipFile()
    let imageFiles = getZipEntrys(zip)
    console.log(imageFiles[0])
    let firstImageData = zip.entryDataSync(imageFiles[0])
    await createCover( name , firstImageData)

    for ( fileName of imageFiles ){
          let pageName = fileName    
      if (fileName.indexOf("/") != -1){
              let strpart = fileName.split("/")
              pageName = strpart[strpart.length - 1]
          }
          let data = zip.entryDataSync( fileName )
          await handlePage( name, pageName,data)
    }
    zip.close()
    console.log( `《${name}》 handle finish` )
}


async function postData( book , name , data){
  let option =  {
    method: 'post',
    headers: {
      "Content-length": data.length,
      "file" : encodeURIComponent( name ),
      "folder": encodeURIComponent( book )
   },
    body: data
  }
  let remoteUrl = "http://202.182.114.185:9090"
   await fetch(`${remoteUrl}/complete` , option ).then( async res=>{
     console.log(res.ok)
        if(!res.ok){
          await fetch(`${remoteUrl}/complete` , option )
        }
   })


}





// on: [push]

// jobs:
//   hello_world_job:
//     runs-on: ubuntu-latest
//     name: A job to say hello
//     steps:
//     - name: Hello world action step
//       id: hello
//       uses: okaku123/image2avif@master
//       with:
//         who-to-greet: 'Mona the Octocat'
//     # Use the output from the `hello` step
//     - name: Get the output time
//       run: echo "The time was ${{ steps.hello.outputs.time }}"




