




const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

















// install script
// npm install --save @saschazar/wasm-avif
// npm install @saschazar/wasm-mozjpeg
// npm install node-fetch

// const fs = require('fs')
// const fetch = require('node-fetch');
// const wasm_avif = require('@saschazar/wasm-avif');   // needed to decode AVIF
// const wasm_mozjpeg = require('@saschazar/wasm-mozjpeg');
// const wasm_image_loader = require('@saschazar/wasm-image-loader');

// const jpegdefaultOptions = require('@saschazar/wasm-mozjpeg/options'); // fully populated options object crucially needed!
// const avifDefaultOptions  = require( '@saschazar/wasm-avif/options');


// const fetchImage = async () => new Uint8Array(await fetch(SAMPLE_URL).then(res => res.buffer()));

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



//  Promise.all([ loadJpegFile() , wasm_image_loader() , wasm_avif() ])
// .then(([buffer, imageLoader, avif ]) => {
//     const rawRBG = imageLoader.decode(buffer, buffer.length, 3)
//     const { height, width } = imageLoader.dimensions()
//     console.log(avifDefaultOptions)
//     var avifBuffer = avif.encode( rawRBG, width, height, 3 , avifDefaultOptions , 1 )
//     fs.writeFileSync(`${__dirname}/test-output.avif` , avifBuffer )
//     imageLoader.free()
//     avif.free()
// })
