/* ==========================================
   HGU Lab
   csvLoader.js

   打者・投手CSV読み込み
========================================== */


/* ==========================================
   グローバルデータ
========================================== */

let batterData = [];

let pitcherData = [];


/* ==========================================
   打者CSV読み込み
========================================== */

async function loadBatters() {

    try {

        const response =
            await fetch(
                "data/batter.csv"
            );


        if (!response.ok) {

            throw new Error(
                `打者CSVの読み込みに失敗しました: ${response.status}`
            );

        }


        const text =
            await response.text();


        batterData =
            csvToObject(text);


        console.log(
            "打者データ",
            batterData
        );


        return batterData;

    } catch (error) {

        console.error(
            "打者CSV読み込みエラー",
            error
        );


        batterData = [];


        return [];

    }

}


/* ==========================================
   投手CSV読み込み
========================================== */

async function loadPitchers() {

    try {

        const response =
            await fetch(
                "data/pitcher.csv"
            );


        if (!response.ok) {

            throw new Error(
                `投手CSVの読み込みに失敗しました: ${response.status}`
            );

        }


        const text =
            await response.text();


        pitcherData =
            csvToObject(text);


        console.log(
            "投手データ",
            pitcherData
        );


        return pitcherData;

    } catch (error) {

        console.error(
            "投手CSV読み込みエラー",
            error
        );


        pitcherData = [];


        return [];

    }

}


/* ==========================================
   CSV → オブジェクト変換
========================================== */

function csvToObject(csv) {

    if (
        !csv ||
        csv.trim() === ""
    ) {

        return [];

    }


    const lines =
        csv
            .trim()
            .split(/\r?\n/);


    if (
        lines.length === 0
    ) {

        return [];

    }


    /* --------------------------------------
       ヘッダー
    -------------------------------------- */

    const headers =
        lines[0]

            .split(",")

            .map(
                header =>
                    header
                        .trim()
                        .replace(/^"|"$/g, "")
            );


    const result = [];


    /* --------------------------------------
       データ
    -------------------------------------- */

    for (
        let i = 1;
        i < lines.length;
        i++
    ) {

        if (
            lines[i].trim() === ""
        ) {

            continue;

        }


        const values =
            lines[i]

                .split(",")

                .map(
                    value =>
                        value
                            .trim()
                            .replace(/^"|"$/g, "")
                );


        const obj = {};


        headers.forEach(
            (header, index) => {

                obj[header] =
                    values[index] !== undefined
                        ? values[index].trim()
                        : "";

            }
        );


        result.push(
            obj
        );

    }


    return result;

}


/* ==========================================
   全CSV読み込み
========================================== */

async function loadAllCSV() {

    await Promise.all([

        loadBatters(),

        loadPitchers()

    ]);


    console.log(
        "打者・投手CSVの読み込み完了"
    );

}


/* ==========================================
   選手名検索
========================================== */

function findBatter(
    playerName
) {

    if (
        !playerName ||
        !Array.isArray(batterData)
    ) {

        return null;

    }


    return (
        batterData.find(
            player => {

                return (

                    player.Player ===
                    playerName

                    ||

                    player["Player Name"] ===
                    playerName

                    ||

                    player.PlayerName ===
                    playerName

                    ||

                    player.Name ===
                    playerName

                );

            }
        )
        || null
    );

}


/* ==========================================
   投手検索
========================================== */

function findPitcher(
    playerName
) {

    if (
        !playerName ||
        !Array.isArray(pitcherData)
    ) {

        return null;

    }


    return (
        pitcherData.find(
            player => {

                return (

                    player.Player ===
                    playerName

                    ||

                    player["Player Name"] ===
                    playerName

                    ||

                    player.PlayerName ===
                    playerName

                    ||

                    player.Name ===
                    playerName

                );

            }
        )
        || null
    );

}


/* ==========================================
   自動読み込み
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadAllCSV();

    }
);