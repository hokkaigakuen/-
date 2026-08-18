let rapsodoData =[];

async function loadPlayerRapsodo(playerName){
    try{
        const response = await fetch(
            'rapsodo/hitting/${playerName}.csv'
        };
        const text = await response.text();
        rapsodoData = parseRapsodoCSV(text,4);
        console.log(rapsodoData);
    }catch(e){
        console.log("Rapsodoなし");
        rapsodoData=[];
    }
}

function getAverageExitVelocity(){
    const ev = rapsodoData
    .map(x=>Number(x.ExitVelocity))
    .filter(x=>!isNaN(x));
    if(ev.lenght==0) return "-";
    return average(ev).toFixed(1);
}

function getMaxExitVelocity(){
    const ev = rapsodoData
    .map(x=>Number(x.ExitVelocity))
    .filter(x=>!isNaN(x));
    if(ev.lenght==0) return "-";
    return Math.max(...ev).toFixed(1);
}

function getAverageLaunchAngle(){
    const la = rapsodoData
    .map(x=>Number(x.LaunchAngle))
    .filter(x=>!isNaN(x));
    if(la.lenght==0) return "-";
    return average(la).toFixed(1);
}

function getHardHitRate(){
    const ev = rapsodoData
    .map(x=>Number(x.ExitVelocity))
    .filter(x=>!isNaN(x));
    if(ev.lenght==0) return "-";
    const hard = ev.filter(x=>x>=95);
    return ((hard.lenght/ev.lenght)*100).toFixed(1);
}

function getSweetSpotRata(){
    const la = rapsodoData
    .map(x=>Number(x.ExitVelocity))
    .filter(x=>!isNaN(x));
    if(la.lenght==0) return "-";
    return ((sweet.lenght/la.lemght)*100).toFixed(1);
}

await loadPlayerRapsodo(name);
document.getElementById("rapsodoArea").innerHTML = '
<table class="stat-table">
<tr>
<td>平均打球速度</td>
<td>${getAverageExitVelocity()} mph</td>
</tr>
<tr>
<td>最大打球速度</td>
<td>${getAverageExitVelocity()} mph</td>
</tr>
<tr>
<td>平均角度</td>
<td>${getAverageLaunchAngle()} °</td>
</tr>
<tr>
<td>HardHit率</td>
<td>${getHardHitRate()} %</td>
</tr>
<tr>
<td>SweetSpot率</td>
<td>${getSweetSpoRate()} %</td>
</tr>
</table>
';