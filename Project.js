require("@babel/polyfill");



document.getElementById("button").addEventListener("click", function (){
  imageAsk();
});


function imageAsk(){
  
  // Require the client
const Clarifai = require('clarifai');
var request = require('request');
var rp = require('request-promise');
const text = document.getElementById("text").value;
console.log(text);

// initialize with your api key. 
const app = new Clarifai.App({
 apiKey: "CLARIFAI_API_KEY"
});

  // Predict the contents of an image by passing in a URL.
app.models.predict(Clarifai.GENERAL_MODEL, text)
.then(response => {
  console.log(response)
  var html =[
    response.outputs[0].data.concepts[0].name,
    response.outputs[0].data.concepts[1].name,
    response.outputs[0].data.concepts[2].name,
    response.outputs[0].data.concepts[3].name,
    response.outputs[0].data.concepts[4].name,
  ]
    

    const API_KEY = "YANDEX_API_KEY"

    var urls = [];

    html.forEach(element => { 
        var replaced = element.split(' ').join('%20');
        element = "https://translate.yandex.net/api/v1.5/tr.json/translate?key="+API_KEY+"&text="+replaced+"&lang=en-es"
        urls.push(element); 
      }); 

    main();

    async function main(){
      try{
    
        var spanishTerms = [];
        console.log(urls)
        const result = await Promise.all(urls.map((urls => {
          return rp({
            url: urls,
            method: 'GET',
          });

        })))
        .then((response)=>{
          response.forEach(element => { 
            var subString = element.substring(element.indexOf("[") + 2,element.lastIndexOf("]")-1);
            spanishTerms.push(subString); 
          });
          
          var stitched = []

          for(let i = 0; i < spanishTerms.length && i < html.length; i++){
            
            //document.write(html[i]+" = ");  
            //document.write(spanishTerms[i]+"<br>");
            stitched.push(html[i]+" = "+spanishTerms[i]+"<br>");
 
          }
          var result = stitched.join(" ");
           document.write(`<img id="image" style = "border: 1px solid #ddd;border-radius: 4px; padding: 5px; width: 150px;"src=${text}><br>
           <div class="result"> Result:<br> ${result} </div>
           `);
          

        })
    
      }catch(e){
        console.log(e.message);
      }
    }
    


})

.catch(err => {
  console.log(err);
});

}





  




