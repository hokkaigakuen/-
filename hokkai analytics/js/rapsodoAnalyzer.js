/* ==========================================
   HGU Lab
   rapsodoAnalyzer.js
   Rapsodo 打撃データ分析
========================================== */


/* ==========================================
   グローバルデータ
========================================== */

let rapsodoData = [];


/* ==========================================
   CSV読み込み
========================================== */

async function loadPlayerRapsodo(playerName) {

    try {

        if (!playerName) {

            throw new Error(
                "選手名が指定されていません。"
            );

        }


        /*
         * GitHub / GitHub Pages用
         *
         * 例：
         * data/rapsodo/hitting/山田太郎.csv
         */

        const filePath =
            `data/rapsodo/hitting/${encodeURIComponent(playerName)}.csv`;


        const response =
            await fetch(filePath);


        if (!response.ok) {

            throw new Error(
                `Rapsodo CSV読み込み失敗: ${response.status}`
            );

        }


        const text =
            await response.text();


        /*
         * Papa Parseを使用
         */

        if (
            typeof Papa === "undefined"
        ) {

            throw new Error(
                "Papa Parseが読み込まれていません。"
            );

        }


        rapsodoData =
            parseRapsodoCSV(
                text
            );


        console.log(
            "Rapsodo Loaded:",
            rapsodoData.length,
            rapsodoData
        );


        return rapsodoData;

    } catch (error) {

        console.warn(
            "Rapsodoデータなし:",
            error
        );


        rapsodoData = [];


        return [];

    }

}


/* ==========================================
   Rapsodo CSV解析
========================================== */

function parseRapsodoCSV(text) {

    if (!text) {

        return [];

    }


    /*
     * Rapsodo CSVは
     * 先頭に説明行などが入る可能性があるため、
     * 複数パターンに対応
     */


    let result =
        Papa.parse(
            text,
            {

                header: true,

                skipEmptyLines: true,

                dynamicTyping: false

            }
        );


    /*
     * headerがうまく認識できなかった場合
     * 4行目をヘッダーとして再解析
     */

    if (
        !result.data.length ||
        !result.meta.fields ||
        !result.meta.fields.includes(
            "ExitVelocity"
        )
    ) {

        result =
            Papa.parse(
                text,
                {

                    header: true,

                    skipEmptyLines: true,

                    dynamicTyping: false,

                    skipFirstNLines: 4

                }
            );

    }


    return result.data || [];

}


/* ==========================================
   数値取得
========================================== */

function getNumericValue(
    row,
    keys
) {

    for (
        const key of keys
    ) {

        if (
            row[key] !== undefined &&
            row[key] !== null &&
            row[key] !== ""
        ) {

            const value =
                Number(
                    String(row[key])
                        .replace(/,/g, "")
                        .replace(/mph/gi, "")
                        .replace(/°/g, "")
                        .trim()
                );


            if (
                Number.isFinite(value)
            ) {

                return value;

            }

        }

    }


    return null;

}


/* ==========================================
   平均値
========================================== */

function calculateAverage(
    values
) {

    if (
        !values ||
        values.length === 0
    ) {

        return null;

    }


    const total =
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        );


    return (
        total / values.length
    );

}


/* ==========================================
   打球速度取得
========================================== */

function getExitVelocities() {

    return rapsodoData

        .map(row => {

            return getNumericValue(
                row,
                [
                    "ExitVelocity",
                    "Exit Velocity",
                    "Exit_Velocity",
                    "EV"
                ]
            );

        })

        .filter(
            value =>
                value !== null
        );

}


/* ==========================================
   打球角度取得
========================================== */

function getLaunchAngles() {

    return rapsodoData

        .map(row => {

            return getNumericValue(
                row,
                [
                    "LaunchAngle",
                    "Launch Angle",
                    "Launch_Angle",
                    "LA"
                ]
            );

        })

        .filter(
            value =>
                value !== null
        );

}


/* ==========================================
   平均打球速度
========================================== */

function getAverageExitVelocity() {

    const ev =
        getExitVelocities();


    if (
        ev.length === 0
    ) {

        return "-";

    }


    return calculateAverage(
        ev
    ).toFixed(1);

}


/* ==========================================
   最大打球速度
========================================== */

function getMaxExitVelocity() {

    const ev =
        getExitVelocities();


    if (
        ev.length === 0
    ) {

        return "-";

    }


    return Math.max(
        ...ev
    ).toFixed(1);

}


/* ==========================================
   平均打球角度
========================================== */

function getAverageLaunchAngle() {

    const la =
        getLaunchAngles();


    if (
        la.length === 0
    ) {

        return "-";

    }


    return calculateAverage(
        la
    ).toFixed(1);

}


/* ==========================================
   Hard-Hit率
========================================== */

/*
 * 一般的な定義：
 * Exit Velocity >= 95 mph
 */

function getHardHitRate() {

    const ev =
        getExitVelocities();


    if (
        ev.length === 0
    ) {

        return "-";

    }


    const hardHit =
        ev.filter(
            value =>
                value >= 95
        );


    return (
        hardHit.length /
        ev.length *
        100
    ).toFixed(1);

}


/* ==========================================
   Sweet Spot率
========================================== */

/*
 * Launch Angle
 * 8〜32度をSweet Spotとして計算
 */

function getSweetSpotRate() {

    const la =
        getLaunchAngles();


    if (
        la.length === 0
    ) {

        return "-";

    }


    const sweetSpot =
        la.filter(
            value =>
                value >= 8 &&
                value <= 32
        );


    return (
        sweetSpot.length /
        la.length *
        100
    ).toFixed(1);

}


/* ==========================================
   打球データ表示
========================================== */

async function displayRapsodo(
    playerName
) {

    await loadPlayerRapsodo(
        playerName
    );


    const area =
        document.getElementById(
            "rapsodoArea"
        );


    if (!area) {

        console.warn(
            "#rapsodoArea が見つかりません。"
        );

        return;

    }


    /*
     * データなし
     */

    if (
        rapsodoData.length === 0
    ) {

        area.innerHTML = `

            <div class="card">

                <h3>📡 Rapsodo</h3>

                <p>
                    Rapsodoデータがありません。
                </p>

            </div>

        `;

        return;

    }


    /*
     * データ表示
     */

    area.innerHTML = `

        <div class="card">

            <h3>📡 Rapsodo 打撃データ</h3>

            <div class="stat-grid">

                <div class="stat-item">

                    <span>
                        平均打球速度
                    </span>

                    <strong>
                        ${getAverageExitVelocity()}
                    </strong>

                    <small>
                        mph
                    </small>

                </div>


                <div class="stat-item">

                    <span>
                        最大打球速度
                    </span>

                    <strong>
                        ${getMaxExitVelocity()}
                    </strong>

                    <small>
                        mph
                    </small>

                </div>


                <div class="stat-item">

                    <span>
                        平均打球角度
                    </span>

                    <strong>
                        ${getAverageLaunchAngle()}
                    </strong>

                    <small>
                        °
                    </small>

                </div>


                <div class="stat-item">

                    <span>
                        Hard-Hit率
                    </span>

                    <strong>
                        ${getHardHitRate()}
                    </strong>

                    <small>
                        %
                    </small>

                </div>


                <div class="stat-item">

                    <span>
                        Sweet Spot率
                    </span>

                    <strong>
                        ${getSweetSpotRate()}
                    </strong>

                    <small>
                        %
                    </small>

                </div>


                <div class="stat-item">

                    <span>
                        打球数
                    </span>

                    <strong>
                        ${rapsodoData.length}
                    </strong>

                    <small>
                        balls
                    </small>

                </div>

            </div>

        </div>

    `;

}


/* ==========================================
   選手ページ用
========================================== */

async function loadRapsodoAnalysis(
    playerName
) {

    return await displayRapsodo(
        playerName
    );

}


/* ==========================================
   現在のページの選手名を取得
========================================== */

function getCurrentPlayerName() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (
        params.get("name") ||
        ""
    );

}


/* ==========================================
   自動読み込み
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const name =
            getCurrentPlayerName();


        if (!name) {

            return;

        }


        /*
         * rapsodoAreaがあるページだけ実行
         */

        const area =
            document.getElementById(
                "rapsodoArea"
            );


        if (!area) {

            return;

        }


        await displayRapsodo(
            name
        );

    }
);