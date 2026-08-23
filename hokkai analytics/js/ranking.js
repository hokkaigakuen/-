/* ==========================================
   HGU Lab
   ranking.js
   ランキングページ
========================================== */


/* ==========================================
   初期化
========================================== */

window.addEventListener(
    "DOMContentLoaded",
    async function () {

        /*
         * CSV読み込み
         */

        if (
            typeof loadBatters === "function"
        ) {

            await loadBatters();

        }


        if (
            typeof loadPitchers === "function"
        ) {

            await loadPitchers();

        }


        /*
         * 初期表示
         */

        showRanking("avg");

    }
);


/* ==========================================
   現在のランキング
========================================== */

let currentRankingType = "avg";

let currentRankingData = [];


/* ==========================================
   ランキング切り替え
========================================== */

function showRanking(type) {

    currentRankingType =
        type;


    let data = [];


    switch (type) {

        case "avg":

            data =
                getAverageRanking();

            createBatterTable(
                data,
                "打率"
            );

            break;


        case "ops":

            data =
                getOPSRanking();

            createBatterTable(
                data,
                "OPS"
            );

            break;


        case "hr":

            data =
                getHomeRunRanking();

            createBatterTable(
                data,
                "本塁打"
            );

            break;


        case "era":

            data =
                getERARanking();

            createPitcherTable(
                data,
                "防御率"
            );

            break;


        case "so":

            data =
                getStrikeoutRanking();

            createPitcherTable(
                data,
                "奪三振"
            );

            break;


        default:

            return;

    }


    currentRankingData =
        data;

}


/* ==========================================
   数値変換
========================================== */

function rankingNumber(value) {

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
                .replace(/%/g, "")
                .trim()
        );


    return Number.isFinite(number)
        ? number
        : 0;

}


/* ==========================================
   列名取得
========================================== */

function getValue(
    player,
    keys
) {

    for (
        const key of keys
    ) {

        if (
            player[key] !== undefined &&
            player[key] !== null &&
            player[key] !== ""
        ) {

            return player[key];

        }

    }


    return "";

}


/* ==========================================
   打率ランキング
========================================== */

function getAverageRanking() {

    if (
        !Array.isArray(batterData)
    ) {

        return [];

    }


    return batterData

        .map(
            player => {

                const avg =
                    getValue(
                        player,
                        [
                            "打率",
                            "AVG",
                            "Batting Average",
                            "BA"
                        ]
                    );


                return {

                    ...player,

                    rankingValue:
                        rankingNumber(avg)

                };

            }
        )

        .filter(
            player =>
                player.rankingValue > 0
        )

        .sort(
            (a, b) =>
                b.rankingValue -
                a.rankingValue
        );

}


/* ==========================================
   OPSランキング
========================================== */

function getOPSRanking() {

    if (
        !Array.isArray(batterData)
    ) {

        return [];

    }


    return batterData

        .map(
            player => {

                let ops =
                    getValue(
                        player,
                        [
                            "OPS",
                            "ops"
                        ]
                    );


                /*
                 * OPS列がない場合
                 * OBP + SLGから計算
                 */

                if (
                    ops === ""
                ) {

                    const obp =
                        rankingNumber(
                            getValue(
                                player,
                                [
                                    "出塁率",
                                    "OBP"
                                ]
                            )
                        );


                    const slg =
                        rankingNumber(
                            getValue(
                                player,
                                [
                                    "長打率",
                                    "SLG"
                                ]
                            )
                        );


                    if (
                        obp > 0 ||
                        slg > 0
                    ) {

                        ops =
                            obp +
                            slg;

                    }

                }


                return {

                    ...player,

                    rankingValue:
                        rankingNumber(ops)

                };

            }
        )

        .filter(
            player =>
                player.rankingValue > 0
        )

        .sort(
            (a, b) =>
                b.rankingValue -
                a.rankingValue
        );

}


/* ==========================================
   本塁打ランキング
========================================== */

function getHomeRunRanking() {

    if (
        !Array.isArray(batterData)
    ) {

        return [];

    }


    return batterData

        .map(
            player => {

                const hr =
                    getValue(
                        player,
                        [
                            "本塁打",
                            "HR",
                            "Home Runs"
                        ]
                    );


                return {

                    ...player,

                    rankingValue:
                        rankingNumber(hr)

                };

            }
        )

        .filter(
            player =>
                player.rankingValue >= 0
        )

        .sort(
            (a, b) =>
                b.rankingValue -
                a.rankingValue
        );

}


/* ==========================================
   防御率ランキング
========================================== */

function getERARanking() {

    if (
        !Array.isArray(pitcherData)
    ) {

        return [];

    }


    return pitcherData

        .map(
            player => {

                const era =
                    getValue(
                        player,
                        [
                            "防御率",
                            "ERA",
                            "Earned Run Average"
                        ]
                    );


                return {

                    ...player,

                    rankingValue:
                        rankingNumber(era)

                };

            }
        )

        .filter(
            player =>
                player.rankingValue >= 0
        )

        .sort(
            (a, b) =>
                a.rankingValue -
                b.rankingValue
        );

}


/* ==========================================
   奪三振ランキング
========================================== */

function getStrikeoutRanking() {

    if (
        !Array.isArray(pitcherData)
    ) {

        return [];

    }


    return pitcherData

        .map(
            player => {

                const strikeout =
                    getValue(
                        player,
                        [
                            "奪三振",
                            "三振",
                            "SO",
                            "Strikeouts"
                        ]
                    );


                return {

                    ...player,

                    rankingValue:
                        rankingNumber(
                            strikeout
                        )

                };

            }
        )

        .filter(
            player =>
                player.rankingValue >= 0
        )

        .sort(
            (a, b) =>
                b.rankingValue -
                a.rankingValue
        );

}


/* ==========================================
   打者ランキング表
========================================== */

function createBatterTable(
    players,
    key
) {

    const rankingList =
        document.getElementById(
            "rankingList"
        );


    if (!rankingList) {

        return;

    }


    let html = `

        <div class="ranking-title">

            <h3>
                ${key}ランキング
            </h3>

            <p>
                全選手
            </p>

        </div>


        <div class="table-wrapper">

            <table id="rankingTable">

                <thead>

                    <tr>

                        <th>
                            順位
                        </th>

                        <th>
                            選手
                        </th>

                        <th>
                            チーム
                        </th>

                        <th
                            data-column="3"
                            onclick="sortRanking(3)"
                        >
                            ${key} ↕
                        </th>

                    </tr>

                </thead>

                <tbody>
    `;


    players.forEach(
        (player, index) => {

            const name =
                getValue(
                    player,
                    [
                        "打者",
                        "選手",
                        "Player",
                        "Player Name",
                        "PlayerName",
                        "Name"
                    ]
                );


            const team =
                getValue(
                    player,
                    [
                        "チーム",
                        "Team",
                        "team"
                    ]
                );


            const value =
                player.rankingValue;


            html += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>

                        <a
                            href="player.html?name=${encodeURIComponent(name)}"
                            class="player-link"
                        >
                            ${name || "-"}
                        </a>

                    </td>

                    <td>
                        ${team || "-"}
                    </td>

                    <td>
                        ${formatRankingValue(
                            value,
                            key
                        )}
                    </td>

                </tr>

            `;

        }
    );


    html += `

                </tbody>

            </table>

        </div>

    `;


    rankingList.innerHTML =
        html;

}


/* ==========================================
   投手ランキング表
========================================== */

function createPitcherTable(
    players,
    key
) {

    const rankingList =
        document.getElementById(
            "rankingList"
        );


    if (!rankingList) {

        return;

    }


    let html = `

        <div class="ranking-title">

            <h3>
                ${key}ランキング
            </h3>

            <p>
                全投手
            </p>

        </div>


        <div class="table-wrapper">

            <table id="rankingTable">

                <thead>

                    <tr>

                        <th>
                            順位
                        </th>

                        <th>
                            選手
                        </th>

                        <th>
                            チーム
                        </th>

                        <th
                            data-column="3"
                            onclick="sortRanking(3)"
                        >
                            ${key} ↕
                        </th>

                    </tr>

                </thead>

                <tbody>
    `;


    players.forEach(
        (player, index) => {

            const name =
                getValue(
                    player,
                    [
                        "ピッチャー",
                        "投手",
                        "選手",
                        "Player",
                        "Player Name",
                        "PlayerName",
                        "Name"
                    ]
                );


            const team =
                getValue(
                    player,
                    [
                        "チーム",
                        "Team",
                        "team"
                    ]
                );


            const value =
                player.rankingValue;


            html += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>

                        <a
                            href="player.html?name=${encodeURIComponent(name)}"
                            class="player-link"
                        >
                            ${name || "-"}
                        </a>

                    </td>

                    <td>
                        ${team || "-"}
                    </td>

                    <td>
                        ${formatRankingValue(
                            value,
                            key
                        )}
                    </td>

                </tr>

            `;

        }
    );


    html += `

                </tbody>

            </table>

        </div>

    `;


    rankingList.innerHTML =
        html;

}


/* ==========================================
   表示形式
========================================== */

function formatRankingValue(
    value,
    key
) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "-";

    }


    if (
        key === "打率"
    ) {

        return Number(value)
            .toFixed(3)
            .replace(/^0(?=\.)/, "");

    }


    if (
        key === "OPS"
    ) {

        return Number(value)
            .toFixed(3);

    }


    if (
        key === "防御率"
    ) {

        return Number(value)
            .toFixed(2);

    }


    return Number(value)
        .toFixed(0);

}


/* ==========================================
   検索
========================================== */

function searchRanking() {

    const input =
        document.getElementById(
            "searchPlayer"
        );


    const table =
        document.getElementById(
            "rankingTable"
        );


    if (
        !input ||
        !table
    ) {

        return;

    }


    const keyword =
        input.value
            .trim()
            .toLowerCase();


    const rows =
        table.querySelectorAll(
            "tbody tr"
        );


    rows.forEach(
        row => {

            const text =
                row.innerText
                    .toLowerCase();


            row.style.display =
                text.includes(keyword)
                    ? ""
                    : "none";

        }
    );

}


/* ==========================================
   ソート
========================================== */

function sortRanking(
    column
) {

    const table =
        document.getElementById(
            "rankingTable"
        );


    if (!table) {

        return;

    }


    const tbody =
        table.querySelector(
            "tbody"
        );


    const rows =
        [
            ...tbody.querySelectorAll(
                "tr"
            )
        ];


    rows.sort(
        (a, b) => {

            const av =
                rankingNumber(
                    a.children[column]
                        ?.innerText
                );


            const bv =
                rankingNumber(
                    b.children[column]
                        ?.innerText
                );


            /*
             * 防御率だけ昇順
             */

            if (
                currentRankingType ===
                "era"
            ) {

                return av - bv;

            }


            return bv - av;

        }
    );


    tbody.innerHTML = "";


    rows.forEach(
        row => {

            tbody.appendChild(
                row
            );

        }
    );


    /*
     * 順位を振り直す
     */

    updateRankingNumbers();

}


/* ==========================================
   順位更新
========================================== */

function updateRankingNumbers() {

    const table =
        document.getElementById(
            "rankingTable"
        );


    if (!table) {

        return;

    }


    const rows =
        table.querySelectorAll(
            "tbody tr"
        );


    let rank = 1;


    rows.forEach(
        row => {

            if (
                row.style.display !==
                "none"
            ) {

                row.children[0]
                    .innerText =
                    rank++;

            }

        }
    );

}


/* ==========================================
   選手ページ
========================================== */

function openPlayer(
    name
) {

    if (!name) {

        return;

    }


    location.href =
        `player.html?name=${encodeURIComponent(name)}`;

}