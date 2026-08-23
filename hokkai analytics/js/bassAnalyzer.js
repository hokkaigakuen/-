/* ==========================================
   HGU Lab
   bassAnalyzer.js
   BASS / JSON / CSV Analysis
========================================== */


/* ==========================================
   グローバルデータ
========================================== */

let bassData = [];
let currentGame = null;

let batterStats = [];
let pitcherStats = [];


/* ==========================================
   BASS JSON 読み込み
========================================== */

async function loadBASS(filePath) {

    try {

        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(
                `BASS JSON読み込み失敗: ${response.status}`
            );
        }

        currentGame = await response.json();

        if (Array.isArray(currentGame)) {

            bassData = currentGame.filter(
                event => event.type === "gamedata"
            );

        } else if (Array.isArray(currentGame.gamedata)) {

            bassData = currentGame.gamedata;

        } else {

            bassData = [];

        }

        console.log(
            "BASS Loaded:",
            bassData.length
        );

        return bassData;

    } catch (error) {

        console.error(
            "BASS JSON読み込みエラー:",
            error
        );

        bassData = [];

        return [];

    }

}


/* ==========================================
   app.jsとの互換用
========================================== */

async function loadGameJSON(
    filePath = "data/bacs/game001.json"
) {

    return await loadBASS(filePath);

}


/* ==========================================
   打者イベント取得
========================================== */

function getBatterEvents(playerID) {

    if (!playerID) return [];

    return bassData.filter(event => {

        return (
            event.batter_of_this_pa_id === playerID ||
            event.batter?.id === playerID
        );

    });

}


/* ==========================================
   投手イベント取得
========================================== */

function getPitcherEvents(playerID) {

    if (!playerID) return [];

    return bassData.filter(event => {

        return (
            event.pitcher_of_this_pa_id === playerID ||
            event.pitcher?.id === playerID
        );

    });

}


/* ==========================================
   選手ID取得
========================================== */

function getPlayerID(name) {

    if (!currentGame) return null;

    const playerLists = [

        currentGame.playerdata,
        currentGame.players,
        currentGame.player_data

    ];

    let players = null;

    for (const list of playerLists) {

        if (Array.isArray(list)) {

            players = list;
            break;

        }

    }

    if (!players) {

        console.warn(
            "JSON内に選手マスターデータがありません。"
        );

        return null;

    }


    const player = players.find(p => {

        return (
            p.player_name === name ||
            p.name === name
        );

    });


    if (!player) return null;


    return (
        player.player_id ??
        player.id ??
        null
    );

}


/* ==========================================
   打者名からイベント取得
========================================== */

function getBatterByName(name) {

    const id = getPlayerID(name);

    if (!id) return [];

    return getBatterEvents(id);

}


/* ==========================================
   3方向打球方向
========================================== */

function getDirection3(events) {

    const result = {

        left: 0,
        center: 0,
        right: 0,
        unknown: 0

    };


    events.forEach(event => {

        const dir =
            event?.batted_ball?.direction_3_division;


        if (
            dir === "Left" ||
            dir === "left" ||
            dir === 1
        ) {

            result.left++;

        }

        else if (
            dir === "Center" ||
            dir === "center" ||
            dir === 2
        ) {

            result.center++;

        }

        else if (
            dir === "Right" ||
            dir === "right" ||
            dir === 3
        ) {

            result.right++;

        }

        else {

            result.unknown++;

        }

    });


    return result;

}


/* ==========================================
   5方向打球方向
========================================== */

function getDirection5(events) {

    const result = {

        left: 0,
        leftCenter: 0,
        center: 0,
        rightCenter: 0,
        right: 0,
        unknown: 0

    };


    events.forEach(event => {

        const dir =
            event?.batted_ball?.direction_5_division;


        if (
            dir === "Left" ||
            dir === "left" ||
            dir === 1
        ) {

            result.left++;

        }

        else if (
            dir === "Left Center" ||
            dir === "leftCenter" ||
            dir === 2
        ) {

            result.leftCenter++;

        }

        else if (
            dir === "Center" ||
            dir === "center" ||
            dir === 3
        ) {

            result.center++;

        }

        else if (
            dir === "Right Center" ||
            dir === "rightCenter" ||
            dir === 4
        ) {

            result.rightCenter++;

        }

        else if (
            dir === "Right" ||
            dir === "right" ||
            dir === 5
        ) {

            result.right++;

        }

        else {

            result.unknown++;

        }

    });


    return result;

}


/* ==========================================
   球種別
========================================== */

function getPitchType(events) {

    const pitch = {};


    events.forEach(event => {

        const type = event?.pitch_type;

        if (!type) return;


        if (!pitch[type]) {

            pitch[type] = 0;

        }


        pitch[type]++;

    });


    return pitch;

}


/* ==========================================
   カウント別
========================================== */

function getCount(events) {

    const count = {};


    events.forEach(event => {

        const ball =
            event?.ball_count ?? 0;

        const strike =
            event?.strike_count ?? 0;


        const key =
            `${ball}-${strike}`;


        if (!count[key]) {

            count[key] = 0;

        }


        count[key]++;

    });


    return count;

}


/* ==========================================
   イニング別
========================================== */

function getInning(events) {

    const inning = {};


    events.forEach(event => {

        const number =
            event?.inning ?? 0;

        const topBottom =
            event?.top_bottom ? "B" : "T";


        const key =
            `${number}${topBottom}`;


        if (!inning[key]) {

            inning[key] = 0;

        }


        inning[key]++;

    });


    return inning;

}


/* ==========================================
   結果別
========================================== */

function getResult(events) {

    const result = {};


    events.forEach(event => {

        const key =
            event?.end_result_id;


        if (key === undefined || key === null) {
            return;
        }


        if (!result[key]) {

            result[key] = 0;

        }


        result[key]++;

    });


    return result;

}


/* ==========================================
   投球位置
========================================== */

function getPitchLocations(events) {

    const locations = [];


    events.forEach(event => {

        if (
            event?.course_x == null ||
            event?.course_y == null
        ) {

            return;

        }


        locations.push({

            x: Number(event.course_x),

            y: Number(event.course_y),

            pitch: event.pitch_type,

            result: event.end_result_id,

            strike: event.strike,

            ball: event.ball

        });

    });


    return locations;

}


/* ==========================================
   BASSのコース座標
========================================== */

/*
   BASSのcourse_x / course_yは
   -0.8〜0.8の座標ではなく、
   おおむね

   X : 0〜200
   Y : 0〜250

   の座標として保存されている。

   そのため、以前の
   x<-0.8 / x>0.8
   という設定は使用しない。
*/


const BASS_ZONE = {

    left: 50,
    right: 150,

    top: 80,
    bottom: 180

};


/* ==========================================
   9分割ゾーン
========================================== */

function getZone(x, y) {

    x = Number(x);
    y = Number(y);


    if (!Number.isFinite(x)) return null;
    if (!Number.isFinite(y)) return null;


    if (
        x < BASS_ZONE.left ||
        x > BASS_ZONE.right ||
        y < BASS_ZONE.top ||
        y > BASS_ZONE.bottom
    ) {

        return null;

    }


    const col =
        Math.min(
            2,
            Math.floor(
                (x - BASS_ZONE.left) /
                ((BASS_ZONE.right - BASS_ZONE.left) / 3)
            )
        );


    const row =
        Math.min(
            2,
            Math.floor(
                (y - BASS_ZONE.top) /
                ((BASS_ZONE.bottom - BASS_ZONE.top) / 3)
            )
        );


    return row * 3 + col + 1;

}


/* ==========================================
   ゾーン投球数
========================================== */

function getZoneCount(events) {

    const zone = {

        1: 0,
        2: 0,
        3: 0,

        4: 0,
        5: 0,
        6: 0,

        7: 0,
        8: 0,
        9: 0

    };


    events.forEach(event => {

        const z =
            getZone(
                event?.course_x,
                event?.course_y
            );


        if (z !== null) {

            zone[z]++;

        }

    });


    return zone;

}


/* ==========================================
   ゾーン×球種
========================================== */

function getZonePitch(events) {

    const data = {};


    events.forEach(event => {

        const zone =
            getZone(
                event?.course_x,
                event?.course_y
            );


        if (zone === null) return;


        if (!data[zone]) {

            data[zone] = {};

        }


        const pitch =
            event?.pitch_type;


        if (!pitch) return;


        if (!data[zone][pitch]) {

            data[zone][pitch] = 0;

        }


        data[zone][pitch]++;

    });


    return data;

}


/* ==========================================
   マップデータ
========================================== */

function getMapData(events) {

    return events

        .filter(event => {

            return (
                event?.course_x != null &&
                event?.course_y != null
            );

        })

        .map(event => {

            return {

                x: Number(event.course_x),

                y: Number(event.course_y),

                pitch: event.pitch_type,

                result: event.end_result_id,

                strike: event.strike,

                ball: event.ball

            };

        });

}


/* ==========================================
   打者CSV読み込み
========================================== */

async function loadBatterStats() {

    try {

        const response =
            await fetch(
                "data/bass/batter.csv"
            );


        if (!response.ok) {

            throw new Error(
                `打者CSV読み込み失敗: ${response.status}`
            );

        }


        const csv =
            await response.text();


        if (
            typeof Papa === "undefined"
        ) {

            throw new Error(
                "Papa Parseが読み込まれていません。"
            );

        }


        batterStats =
            Papa.parse(csv, {

                header: true,

                skipEmptyLines: true

            }).data;


        console.log(
            "Batter CSV Loaded:",
            batterStats.length
        );


        return batterStats;

    } catch (error) {

        console.error(
            "打者CSVエラー:",
            error
        );

        batterStats = [];

        return [];

    }

}


/* ==========================================
   投手CSV読み込み
========================================== */

async function loadPitcherStats() {

    try {

        const response =
            await fetch(
                "data/bass/pitcher.csv"
            );


        if (!response.ok) {

            throw new Error(
                `投手CSV読み込み失敗: ${response.status}`
            );

        }


        const csv =
            await response.text();


        if (
            typeof Papa === "undefined"
        ) {

            throw new Error(
                "Papa Parseが読み込まれていません。"
            );

        }


        pitcherStats =
            Papa.parse(csv, {

                header: true,

                skipEmptyLines: true

            }).data;


        console.log(
            "Pitcher CSV Loaded:",
            pitcherStats.length
        );


        return pitcherStats;

    } catch (error) {

        console.error(
            "投手CSVエラー:",
            error
        );

        pitcherStats = [];

        return [];

    }

}


/* ==========================================
   打者取得
========================================== */

function getBatter(name) {

    return batterStats.find(
        player =>
            player["打者"] === name ||
            player["選手名"] === name ||
            player["player_name"] === name
    );

}


/* ==========================================
   投手取得
========================================== */

function getPitcher(name) {

    return pitcherStats.find(
        player =>
            player["投手"] === name ||
            player["ピッチャー"] === name ||
            player["選手名"] === name ||
            player["player_name"] === name
    );

}


/* ==========================================
   数値変換
========================================== */

function toNumber(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return 0;

    }


    const number =
        Number(
            String(value)
                .replace(/,/g, "")
                .replace("%", "")
        );


    return Number.isFinite(number)
        ? number
        : 0;

}


/* ==========================================
   打者主要成績
========================================== */

function getBatterSummary(name) {

    const p =
        getBatter(name);


    if (!p) return null;


    return {

        team: p["チーム"],

        game: toNumber(p["試合数"]),

        pa: toNumber(p["打席"]),

        ab: toNumber(p["打数"]),

        hit: toNumber(p["安打"]),

        double: toNumber(p["2塁打"]),

        triple: toNumber(p["3塁打"]),

        hr: toNumber(p["本塁打"]),

        rbi: toNumber(p["打点"]),

        bb: toNumber(p["四球"]),

        so: toNumber(p["三振"]),

        avg: p["打率"],

        obp: p["出塁率"],

        slg: p["長打率"],

        ops: p["OPS"],

        isop: p["IsoP"],

        babip: p["BABIP"],

        kRate: p["三振率"],

        bbRate: p["四球率"]

    };

}


/* ==========================================
   投手主要成績
========================================== */

function getPitcherSummary(name) {

    const p =
        getPitcher(name);


    if (!p) return null;


    return {

        team: p["チーム"],

        inning: p["投球回"],

        era: p["防御率"],

        whip: p["WHIP"],

        strikeout: p["三振"],

        walk: p["四球"],

        hit: p["安打"],

        hr: p["本塁打"],

        k9: p["K/9"],

        bb9: p["BB/9"],

        kbb: p["K/BB"],

        fip: p["FIP"]

    };

}


/* ==========================================
   規定打席
========================================== */

function isQualifiedBatter(player) {

    const pa =
        Number(player["打席"] || 0);

    const game =
        Number(player["試合数"] || 0);


    return (
        game > 0 &&
        pa >= game * 3.1
    );

}


/* ==========================================
   規定投球回
========================================== */

function isQualifiedPitcher(player) {

    const inning =
        Number(player["投球回"] || 0);

    const game =
        Number(player["試合数"] || 0);


    return (
        game > 0 &&
        inning >= game
    );

}


/* ==========================================
   打率ランキング
========================================== */

function getAverageRanking(limit = 20) {

    return batterStats

        .filter(isQualifiedBatter)

        .sort(
            (a, b) =>
                Number(b["打率"] || 0) -
                Number(a["打率"] || 0)
        )

        .slice(0, limit);

}


/* ==========================================
   OPSランキング
========================================== */

function getOPSRanking(limit = 20) {

    return batterStats

        .filter(isQualifiedBatter)

        .sort(
            (a, b) =>
                Number(b["OPS"] || 0) -
                Number(a["OPS"] || 0)
        )

        .slice(0, limit);

}


/* ==========================================
   本塁打ランキング
========================================== */

function getHomeRunRanking(limit = 20) {

    return [...batterStats]

        .sort(
            (a, b) =>
                Number(b["本塁打"] || 0) -
                Number(a["本塁打"] || 0)
        )

        .slice(0, limit);

}


/* ==========================================
   打点ランキング
========================================== */

function getRBIRanking(limit = 20) {

    return [...batterStats]

        .sort(
            (a, b) =>
                Number(b["打点"] || 0) -
                Number(a["打点"] || 0)
        )

        .slice(0, limit);

}


/* ==========================================
   防御率ランキング
========================================== */

function getERARanking(limit = 20) {

    return pitcherStats

        .filter(isQualifiedPitcher)

        .sort(
            (a, b) =>
                Number(a["防御率"] || 999) -
                Number(b["防御率"] || 999)
        )

        .slice(0, limit);

}


/* ==========================================
   奪三振ランキング
========================================== */

function getStrikeoutRanking(limit = 20) {

    return [...pitcherStats]

        .sort(
            (a, b) =>
                Number(b["三振"] || 0) -
                Number(a["三振"] || 0)
        )

        .slice(0, limit);

}


/* ==========================================
   チーム内選手
========================================== */

function getTeamPlayers(team) {

    return batterStats.filter(
        player =>
            player["チーム"] === team
    );

}