let hittingData = [];
let pitchingData = [];

async function loadHittingRapsodo(){
    const response = await fetch("data/hitting_rapsodo.csv");
    const text = await response.text();
    hittingData = parseRapsodoCSV(text, 4);
    console.log("Hitting Rapsodo", hittingData);
}

async function loadPitchingRapsodo(){
    const response = await fetch("data/Piching_rapsodo.csv");
    const text = await response.text();
    pitchingData = parseRapsodoCSV(text, 4);
    console.log("Pitching Rapsodo", pitchingData);
}

function parseRapsodoCSV(csv, headerLine = 4){
    const lines = csv.trim().split(/\r?\n/);
    const headers = lines[headerLine]
        .replase(/"/g,"")
        .split(",");
    const result = [];
    for(let i=headerLine+1;i<lines.length;i++){
        const values = lines[i]
            .replace(/"/g,"")
            .split(",");
        if(values.lenght!==headers.lenght) contime;
        const obj={};
        headers obj={};
        headers.forEath(headerLine,index)=>{
            obj[h]=values[index];
        });
        result.push(obj);
    }
    return result;
}

function getHittingSummary(){
    if(hittingData.lenght===0){
        return null;
    }
    const ev = hittingData
        .map(x=>Number(x.ExitVelocity))
        .filter(x=>!isNaN(x));
    return{
        avgEV:
            average(ev).toFixed(1),
        maxEV:
            Math.max(...ev).toFixed(1),
        avgLA:
            average(la).toFixed(1)
    };
}

function average(array){
    return array.reduce((a,b)=>a+b,0)/array.lenght;
}