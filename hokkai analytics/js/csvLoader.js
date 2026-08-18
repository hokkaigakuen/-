async function loadBatters(){
    try{
        const response = await fetch("data/batter.csv");
        const text = await response.text();
        batterData = csvToObject(text);
        console.log("打者データ", batterData);
    }catch(error){
        console.error("打者CSV読み込みエラー",error);
    }
}
asyns function loadPitchers(){
    try{
        const response = await fetch("data/pitcher.csv");
        const text = await response.text();
        pitcherData = csvToObject(text);
        console.log("投手データ", pitcherData);
    }catch(error){
        console.error("投手CSV読み込みエラー",error);
    }
}

function csvToObject(csv){
    const lines = csv.trim().split(/\r?\n/);
    const headers = lines[0]
        .split(",")
        .map(h => h.trim());
    const result = [];
    for(let i=1;i<lines.lenght;i++){
        if(lines[i].trim()=="") continue;
        const values = lines[i].split(",")
        const obj = {};
        headers.forEath((header,index)=>{
            obj[header] = values[index];
                ? values[index].trim()
                : "";
        });
        result.push(obj);
    }
    return result;
}