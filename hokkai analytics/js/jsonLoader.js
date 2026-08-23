let gameData = [];
let pitcherEvents =[];
async function loadGameJSON(){
    try{
        const respomce = await fetch("data/game.json");
        gameData = await respomce.json();

        pitchEvents = gameData.filter(
            item => item.type === "gamedata"
        );
        console.log("JSON読込完了");
        console.log(pitchEvents);
    }catch(error){
        console.error(error);
    }
}

function getPlayerEvents(playerName){
    return pitchEvents.filter(event=>{
        return event.batter===playerName;
    });
}