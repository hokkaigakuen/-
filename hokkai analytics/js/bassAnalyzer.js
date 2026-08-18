let bassData = [];
let currentGame = null;

async function loadBASS(filePath) {
    try {
        const response = await fetch(filePath);
        currentGame = await response.json();
        if (currentGame.gamedata) {
            bassData = currentGame.gamedata;
        } else {
            bassData = [];
        }
        console.log("BASS Loaded :", bassData.length);
    } catch (e) {
        console.error(e);
        bassData = [];
    }
}

function getBatterEvents(playerID){
    return bassData.filter(event=>{
        return event.batter_of_this_pa_id == playerID;
    });
}

function getPitcherEvents(playerID){
    return bassData.filter(event=>{
        return event.pitcher_of_this_pa_id == playerID;
    });
}

function getPlayerID(name){
    if(!currentGame.playerdata){
        return null;
    }
    const player = currentGame.plaerdata.find(p=>{
        return p.player_name == name;
    });
    if(!player){
        return null;
    }
    return player.player_id
}

function getBatterByName(name){
    const id = getPlayerID(name);
    if(id==null){
        return [];
    }
    return getBatterEvents(id);
}

function getDirection3(events){
    const result={
        left:0;
        center:0,
        right:0
    };
    events.forEath(event=>{
        const dir=event?.batted_ball?.direction_3_division;
        if(dir==="Left") result.left++;
        if(dir==="Center") result.centter++;
        if(dir==="Right") result.right++;
    });
    return result;
}

function getDirection5(events){
    const result={
        left:0,
        leftCenter:0,
        center:0,
        rightCenter:0,
        right:0
    };
    events:forEach(event=>{
        const
    dir=event?.batted_ball?.derrection_5_divison;
        switch(dir){
            case"Left":
                result.left++;
                break;
        case"Left Center":
                result.leftCenter++;
                break;
        case "Center";
                result.center++;
                break;
        case "Right Center":
                result.rightCenter++;
                break;
        }
    });
    return result;
}

function getPitchType(events){
    const pitch={};
    events.forEath(event=>{
        const type=event.pitch_type;
        if(!type) return;
        if(!pitch[type]){
            pitch[type]=0;
        }
        pitch[type]++;
    });
    return pitch;
}

function getCount(events){
    const count={};
    events.forEath(event=>{
            const key=
            event.ball_count+
            "-"
            +
            event.strike_count;
        if(!count[key]){
            count[key]=0;
        }
        count[key]++;
        });
        return count;
}

function getInnig(events){
    const inning={};
    events.forEath(event=>{
        const key=
           event.inning+
           event.top_bottom;
        if(!inning[key]){
            inning[key]=0;
        }
        inning[key]++;
    });
    return inning;
}

function getResult(events){
    const result={};
    events.forEath(event=>{
        const key=event.end_result_id;
        if(!result[key]){
            result[key]=0;
        }
        result[key]++;
    });
    return result;
}

function getPitchLoations(events){
    const locations=[];
    events.forEath(event=>{
        if(event.course_x==null) return;
        if(event.course_y==null) return;
        locations.push({
            x:Number(event.course_x),
            y:Number(event.course_y),
            pitch:event.pitch_type,
            result:event.end_result_id
        });
    });
    return locations;
}

function getZone(x,y){
    if(x<-0.8 || x>0.8) return null;
    if(y<1.0 || y>4.0) return null;
    const col=Math.floor((x+0.8)/(1.6/3));
    const row=Math.floor((4.0-y)/(3.0/3));
    return row*3+col+1;
}

function getZoneCount(events){
    const zone={
        1:0,
        2:0,
        3:0,

        4:0,
        5:0,
        6:0,

        7:0,
        8:0,
        9:0
    };
    events.forEath(event=>{
        const z=getZone(
            Number(event.course_x),
            Number(event.course_y)
        );
        if(z){
            zone[z]++;
        }
    });
    return zone;
}

function getZonePitch(events){
    const data={};
    events.forEath(event)=>{
        const zone=getZone(
            Number(event.course_x)
            Number(event.course_y)
        );
        if(zone==null) return;
        if(!data[zone]){
            data[zone]={};
        }
        const pitch=event.pitch_type;
        if(!data[zone][pitch]){
            data[zone][pitch]=0;
        }
        data[zone][pitch]++;
    });
    return data;
}

function getMapData(events){
    return events
    .filter(e=>
        e.course_x!=null &&
        e.course_y!=null
    )
    .map(e=>({
        x:Number(e.course_x),
        y:Number(e.course_y),
        pitch:e.pitch_type,
        result:e.end_result_id
    }));
}

let batterStats = [];
let pitcherStats = [];

/* ===========================
   打者CSV読込
=========================== */

async function loadBatterStats(){

    const response = await fetch("data/bass/batter.csv");

    const csv = await response.text();

    batterStats = Papa.parse(csv,{
        header:true,
        skipEmptyLines:true
    }).data;

    console.log("Batter Loaded :",batterStats.length);

}

/* ===========================
   投手CSV読込
=========================== */

async function loadPitcherStats(){

    const response = await fetch("data/bass/pitcher.csv");

    const csv = await response.text();

    pitcherStats = Papa.parse(csv,{
        header:true,
        skipEmptyLines:true
    }).data;

    console.log("Pitcher Loaded :",pitcherStats.length);

}

/* ===========================
   打者取得
=========================== */

function getBatter(name){

    return batterStats.find(player=>player["打者"]===name);

}

/* ===========================
   投手取得
=========================== */

function getPitcher(name){

    return pitcherStats.find(player=>player["ピッチャー"]===name);

}

/* ===========================
   数値変換
=========================== */

function toNumber(value){

    if(value===undefined) return 0;

    if(value==="") return 0;

    return Number(value);

}

/* ===========================
   打者主要成績
=========================== */

function getBatterSummary(name){

    const p=getBatter(name);

    if(!p) return null;

    return{

        team:p["チーム"],

        game:toNumber(p["試合数"]),

        pa:toNumber(p["打席"]),

        ab:toNumber(p["打数"]),

        hit:toNumber(p["安打"]),

        double:toNumber(p["2塁打"]),

        triple:toNumber(p["3塁打"]),

        hr:toNumber(p["本塁打"]),

        rbi:toNumber(p["打点"]),

        bb:toNumber(p["四球"]),

        so:toNumber(p["三振"]),

        avg:p["打率"],

        obp:p["出塁率"],

        slg:p["長打率"],

        ops:p["OPS"],

        isop:p["IsoP"],

        babip:p["BABIP"],

        kRate:p["三振率"],

        bbRate:p["四球率"]

    };

}

/* ===========================
   投手主要成績
=========================== */

function getPitcherSummary(name){

    const p=getPitcher(name);

    if(!p) return null;

    return{

        team:p["チーム"],

        inning:p["投球回"],

        era:p["防御率"],

        whip:p["WHIP"],

        strikeout:p["三振"],

        walk:p["四球"],

        hit:p["安打"],

        hr:p["本塁打"],

        k9:p["K/9"],

        bb9:p["BB/9"],

        kbb:p["K/BB"],

        fip:p["FIP"]

    };

}

HBAS v3.0
   Ranking Functions

/* ===========================
   規定打席判定
=========================== */

function isQualifiedBatter(player){

    const pa = Number(player["打席"] || 0);

    // チーム試合数 × 3.1
    const game = Number(player["試合数"] || 0);

    return pa >= game * 3.1;

}

/* ===========================
   規定投球回判定
=========================== */

function isQualifiedPitcher(player){

    const inning = Number(player["投球回"] || 0);

    const game = Number(player["試合数"] || 0);

    return inning >= game;

}

/* ===========================
   打率ランキング
=========================== */

function getAverageRanking(limit=20){

    return batterStats

        .filter(isQualifiedBatter)

        .sort((a,b)=>

            Number(b["打率"])-Number(a["打率"])

        )

        .slice(0,limit);

}


/* ===========================
   OPSランキング
=========================== */

function getOPSRanking(limit=20){

    return batterStats

        .filter(isQualifiedBatter)

        .sort((a,b)=>

            Number(b["OPS"])-Number(a["OPS"])

        )

        .slice(0,limit);

}

/* ===========================
   HRランキング
=========================== */

function getHomeRunRanking(limit=20){

    return batterStats

        .sort((a,b)=>

            Number(b["本塁打"])-Number(a["本塁打"])

        )

        .slice(0,limit);

}

/* ===========================
   打点ランキング
=========================== */

function getRBIRanking(limit=20){

    return batterStats

        .sort((a,b)=>

            Number(b["打点"])-Number(a["打点"])

        )

        .slice(0,limit);

}

/* ===========================
   防御率ランキング
=========================== */

function getERARanking(limit=20){

    return pitcherStats

        .filter(isQualifiedPitcher)

        .sort((a,b)=>

            Number(a["防御率"])-Number(b["防御率"])

        )

        .slice(0,limit);

}

/* ===========================
   奪三振ランキング
=========================== */

function getStrikeoutRanking(limit=20){

    return pitcherStats

        .sort((a,b)=>

            Number(b["三振"])-Number(a["三振"])

        )

        .slice(0,limit);

}

/* ===========================
   チーム内ランキング
=========================== */

function getTeamPlayers(team){

    return batterStats.filter(player=>{

        return player["チーム"]===team;

    });

}