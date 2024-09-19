let currentsong = new Audio();
let songs;
let currentfolder;
let on = document.getElementById("on");
let previous = document.getElementById("previous");
let next = document.getElementById("next");

function secondsToMinutesSeconds(seconds) {
   if (isNaN (seconds)||seconds<0){
      // return"invalid input";
      return "00";
   }
     const minutes=Math.floor (seconds/60);
    const remainingseconds =Math.floor(seconds%60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingseconds).padStart(2, '0');
    // console.log(formattedMinutes)
    // console.log(formattedSeconds)

    return `${formattedMinutes}:${formattedSeconds}`;
}

 async function getsongs(folder) {
  currentfolder=folder;
    // let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response =await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML=response;
    let as = div.getElementsByTagName("a")
     songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
          songs.push(element.href.split(`/${folder}/`)[1]);

        }
    };
    let songUL = document.querySelector(".mysongs").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
      songUL.innerHTML += `<li> 
                     <img src="/music-note-2-svgrepo-com.svg" alt="">
                     <div class="info">
                         <div>  ${decodeURIComponent(song)}</div>
                         
                     </div>
                     <div class="playnow">
                         <span>Play now</span>
                         <img src="playoncard.svg" alt="">
                     </div>
                 </li>`;


    }
    Array.from (document.querySelector (".mysongs").getElementsByTagName("li")).forEach( e=>{
      e.addEventListener("click",element=> {
        
          // console.log(e.querySelector(".info").firstElementChild.innerHTML)
          playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      }
      )
   })

}
const playMusic =(track,pause=false)=> {
  //let audio = new Audio(`/${currentfolder}/` + track); // This is redundant

if(!pause){
  currentsong.play();
  on.src="pause.svg"
}
  currentsong.src=`/${currentfolder}/` +track;
  currentsong.play();
  document.querySelector(".songinfo").innerHTML=decodeURI(track);
  document.querySelector(".songtime").innerHTML="00:00/00:00";
}
 
async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response =await a.text();
  let div = document.createElement("div")
  div.innerHTML=response;
  // console.log(response);

  let cardcontainer=document.querySelector(".cardcontainer")
 let anchors = div.getElementsByTagName("a")
 let array=Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
    // console.log(e.href)
    let folder=(e.href.split("/").slice(-2)[1])
   if(e.href.includes(`/songs/${folder}`)){

     console.log(e.href.split("/").slice(-2)[1])
     //get the metadeta of folder
     let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
     let response =await a.json();
    //  console.log(response);
     cardcontainer.innerHTML=cardcontainer.innerHTML+`
      <div data-folder="${folder}" class="card">
                    <img class="cardimg" src="/songs/${folder}/cover.jpg" alt="">
                    <div class="play"><img src="playoncard.svg" alt=""></div>
                    <div class="discription">
                        <h2>${response.title}</h2>
                        <h3>${response.description}
                        </h3>
                    </div>
                </div>
     `
    }
 }
 
 Array.from(document.getElementsByClassName("card")).forEach(e=> {
   e.addEventListener("click", async item => {
     // console.log(e)
     console.log(item,item.currentTarget.dataset)
     await getsongs(`songs/${item.currentTarget.dataset.folder}`);
     
     
     
    })
  })
}
  

  
async function main(){
    //get all songs list
     
   await getsongs("songs/Hindi");
    // plays music when doucument is running firstly
    // playMusic(songs[0],true) 
    on.src="pause.svg"
    //Display all songs album on page
    displayAlbums()
    
    



//play the first song 
// var audio = new Audio (songs[0]);
// audio.play();
// audio.addEventListener("loadeddata",()=>{
//     let duration = audio.duration;
//     console.log(audio.duration,audio.currentSrc,audio.currentTime)
// })



//attach  am event lisner to each song
 Array.from (document.querySelector (".mysongs").getElementsByTagName("li")).forEach( e=>{
    e.addEventListener("click",element=> {
      
        // console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    }
    )
 })

//attach an event listner to on ,next and previous
on.addEventListener("click", () => {
  if (currentsong.paused){
    currentsong.play()
    on.src="pause.svg"
  }else{
    currentsong.pause()
    on.src="play.svg"
  }

})
// play.addEventListener("click", () => {
//   if (currentsong.paused){
//     currentsong.play()
//     on.src="pause.svg"
//   }else{
//     currentsong.pause()
//     on.src="play.svg"
//   }

// })
currentsong.addEventListener("timeupdate",() => {
  console.log(currentsong.currentTime,currentsong.duration);
  document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
  document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";
})
//add event listner to seekbar 
document.querySelector(".seekbar").addEventListener("click",e  => {
  let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
  // document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100+"%";
  document.querySelector(".circle").style.left=percent +"%";
  currentsong.currentTime=((currentsong.duration)*percent)/100
}
)
////add event listner to hamberger
document.querySelector(".hamburger").addEventListener("click",() => {
  document.querySelector(".left").style.left="0";
  
}
)
//add event listner to close button
document.querySelector(".close").addEventListener("click",() => {
  document.querySelector(".left").style.left="-120%";
  
}
)
//add event listner to previus next
previous.addEventListener("click",() => {
  // console.log("previous clicked")
  // console.log(currentsong)
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
  if (index - 1 >= 0) {
    playMusic(songs[index - 1]);
}

}
)
next.addEventListener("click",() => {
  // currentsong.pause()
  // console.log("next clicked")
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
  if (index + 1 < songs.length) {
    playMusic(songs[index + 1]);
}

}
)
//Load the playlist when card is clicked
//  Array.from(document.getElementsByClassName("card")).forEach(e=> {
//   e.addEventListener("click", async item => {
//     // console.log(e)
//     console.log(item,item.currentTarget.dataset)
//     await getsongs(`songs/${item.currentTarget.dataset.folder}`);
    
    
    
//   })
// })
}
main()