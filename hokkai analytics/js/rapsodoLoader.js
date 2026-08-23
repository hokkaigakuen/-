/* ==========================================
   HGU Lab
   rapsodoLoader.js
   Rapsodo CSV Loader
========================================== */


/* ==========================================
   グローバルデータ
========================================== */

let hittingData = [];

let pitchingData = [];


/* ==========================================
   Rapsodo CSV読み込み
========================================== */

async function loadHittingRapsodo() {

    try {

        const response =
            await fetch(
                "data/hitting_rapsodo.csv"
            );


        if (!response.ok) {

            throw new Error(
                `Hitting Rapsodo CSV読み込み失敗: ${response.status}`
            );

        }


        const text =
            await response.text();


        hittingData =
            parseRapsodoCSV(
                text,
                4
            );


        console.log(
            "Hitting Rapsodo:",
            hittingData
        );


        return hittingData;

    } catch (error) {

        console.error(
            "Hitting Rapsodo読み込みエラー:",
            error
        );


        hittingData = [];


        return [];

    }

}


/* ==========================================
   Rapsodo 投球データ読み込み
========================================== */

async function loadPitchingRapsodo() {

    try {

        const response =
            await fetch(
                "data/Piching_rapsodo.csv"
            );


        if (!response.ok) {

            throw new Error(
                `Pitching Rapsodo CSV読み込み失敗: ${response.status}`
            );

        }


        const text =
            await response.text();


        pitchingData =
            parseRapsodoCSV(
                text,
                4
            );


        console.log(
            "Pitching Rapsodo:",
            pitchingData
        );


        return pitchingData;

    } catch (error) {

        console.error(
            "Pitching Rapsodo読み込みエラー:",
            error
        );


        pitchingData = [];


        return [];

    }

}


/* ==========================================
   CSV解析
========================================== */

function parseRapsodoCSV(
    csv,
    headerLine = 4
) {

    if (!csv) {

        return [];

    }


    /*
     * 行ごとに分割
     */

    const lines =
        csv
            .trim()
            .split(/\r?\n/);


    if (
        lines.length <= headerLine
    ) {

        console.warn(
            "Rapsodo CSVの行数が不足しています。"
        );

        return [];

    }


    /*
     * ヘッダー取得
     */

    const headers =
        lines[headerLine]

            .replace(/"/g, "")

            .split(",")

            .map(
                header =>
                    header.trim()
            );


    const result = [];


    /*
     * データ行
     */

    for (
        let i = headerLine + 1;
        i < lines.length;
        i++
    ) {

        if (
            !lines[i].trim()
        ) {

            continue;

        }


        const values =
            lines[i]

                .replace(/"/g, "")

                .split(",")

                .map(
                    value =>
                        value.trim()
                );


        /*
         * 列数が違う場合
         */

        if (
            values.length !==
            headers.length
        ) {

            console.warn(
                "Rapsodo CSVの列数が一致しません:",
                i,
                values.length,
                headers.length
            );

            continue;

        }


        const obj = {};


        /*
         * ヘッダーと値を対応させる
         */

        headers.forEach(
            (header, index) => {

                obj[header] =
                    values[index];

            }
        );


        result.push(
            obj
        );

    }


    return result;

}


/* ==========================================
   数値変換
========================================== */

function rapsodoNumber(
    value
) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return null;

    }


    const number =
        Number(
            String(value)
                .replace(/,/g, "")
                .replace(/mph/gi, "")
                .replace(/°/g, "")
                .trim()
        );


    if (
        Number.isFinite(number)
    ) {

        return number;

    }


    return null;

}


/* ==========================================
   平均
========================================== */

function average(
    array
) {

    if (
        !Array.isArray(array) ||
        array.length === 0
    ) {

        return null;

    }


    return (
        array.reduce(
            (sum, value) =>
                sum + value,
            0
        )
        /
        array.length
    );

}


/* ==========================================
   打者Rapsodoまとめ
========================================== */

function getHittingSummary() {

    if (
        hittingData.length === 0
    ) {

        return null;

    }


    /*
     * 打球速度
     */

    const ev =
        hittingData

            .map(
                row =>
                    rapsodoNumber(
                        row.ExitVelocity
                    )
            )

            .filter(
                value =>
                    value !== null
            );


    /*
     * 打球角度
     */

    const la =
        hittingData

            .map(
                row =>
                    rapsodoNumber(
                        row.LaunchAngle
                    )
            )

            .filter(
                value =>
                    value !== null
            );


    return {

        sampleSize:
            hittingData.length,


        avgEV:
            ev.length > 0
                ? average(ev).toFixed(1)
                : "-",


        maxEV:
            ev.length > 0
                ? Math.max(
                    ...ev
                ).toFixed(1)
                : "-",


        avgLA:
            la.length > 0
                ? average(la).toFixed(1)
                : "-"

    };

}


/* ==========================================
   投手Rapsodoまとめ
========================================== */

function getPitchingSummary() {

    if (
        pitchingData.length === 0
    ) {

        return null;

    }


    /*
     * 球速
     */

    const velocity =
        pitchingData

            .map(
                row =>
                    rapsodoNumber(
                        row.Velocity ??
                        row.ReleaseSpeed ??
                        row.Speed
                    )
            )

            .filter(
                value =>
                    value !== null
            );


    /*
     * 回転数
     */

    const spin =
        pitchingData

            .map(
                row =>
                    rapsodoNumber(
                        row.SpinRate ??
                        row.Spin
                    )
            )

            .filter(
                value =>
                    value !== null
            );


    return {

        sampleSize:
            pitchingData.length,


        avgVelocity:
            velocity.length > 0
                ? average(
                    velocity
                ).toFixed(1)
                : "-",


        maxVelocity:
            velocity.length > 0
                ? Math.max(
                    ...velocity
                ).toFixed(0)
                : "-",


        avgSpinRate:
            spin.length > 0
                ? average(
                    spin
                ).toFixed(0)
                : "-"

    };

}


/* ==========================================
   打者データ取得
========================================== */

function getHittingPlayerData(
    playerName
) {

    if (
        !playerName ||
        hittingData.length === 0
    ) {

        return [];

    }


    return hittingData.filter(
        row => {

            return (

                row.Player ===
                playerName

                ||

                row["Player Name"] ===
                playerName

                ||

                row.PlayerName ===
                playerName

                ||

                row.Name ===
                playerName

            );

        }
    );

}


/* ==========================================
   投手データ取得
========================================== */

function getPitchingPlayerData(
    playerName
) {

    if (
        !playerName ||
        pitchingData.length === 0
    ) {

        return [];

    }


    return pitchingData.filter(
        row => {

            return (

                row.Player ===
                playerName

                ||

                row["Player Name"] ===
                playerName

                ||

                row.PlayerName ===
                playerName

                ||

                row.Name ===
                playerName

            );

        }
    );

}


/* ==========================================
   初期読み込み
========================================== */

async function loadAllRapsodo() {

    await Promise.all([

        loadHittingRapsodo(),

        loadPitchingRapsodo()

    ]);


    console.log(
        "Rapsodoデータ読み込み完了"
    );

}


/* ==========================================
   自動読み込み
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        /*
         * Rapsodo CSVが存在するページだけ
         * 読み込む
         */

        await loadAllRapsodo();

    }
);