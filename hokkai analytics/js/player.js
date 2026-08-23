/* ==========================================
   HGU Lab
   player.js
   選手詳細ページ
========================================== */


/* ==========================================
   現在の選手
========================================== */

let playerName = "";


/* ==========================================
   URLから選手名を取得
========================================== */

function getPlayerName() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const name =
        params.get("name");


    if (!name) {

        console.warn(
            "URLに選手名がありません。"
        );

        return "";

    }


    return name;

}


/* ==========================================
   HTMLエスケープ
========================================== */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* ==========================================
   初期処理
========================================== */

window.addEventListener(
    "DOMContentLoaded",
    async function () {

        playerName =
            getPlayerName();


        if (!playerName) {

            showError(
                "選手名が指定されていません。"
            );

            return;

        }


        await initializePlayer();

    }
);


/* ==========================================
   選手ページ初期化
========================================== */

async function initializePlayer() {

    try {

        /*
         * BASS CSV
         */

        if (
            typeof loadBatterStats ===
            "function"
        ) {

            await loadBatterStats();

        }


        if (
            typeof loadPitcherStats ===
            "function"
        ) {

            await loadPitcherStats();

        }


        /*
         * 選手情報
         */

        loadPlayer();


        /*
         * JSON分析
         */

        loadJSONAnalysis();


    } catch (error) {

        console.error(
            "選手ページ読み込みエラー:",
            error
        );

        showError(
            "選手データの読み込み中にエラーが発生しました。"
        );

    }

}


/* ==========================================
   選手情報読み込み
========================================== */

function loadPlayer() {

    let batter = null;
    let pitcher = null;


    if (
        typeof getBatterSummary ===
        "function"
    ) {

        batter =
            getBatterSummary(
                playerName
            );

    }


    if (
        typeof getPitcherSummary ===
        "function"
    ) {

        pitcher =
            getPitcherSummary(
                playerName
            );

    }


    /*
     * ヘッダー
     */

    setText(
        "playerName",
        playerName
    );

    setText(
        "name",
        playerName
    );


    /*
     * 打者
     */

    if (batter) {

        showBatter(batter);

    }


    /*
     * 投手
     */

    if (pitcher) {

        showPitcher(pitcher);

    }


    /*
     * どちらもない
     */

    if (!batter && !pitcher) {

        showError(
            `${playerName} のデータが見つかりません。`
        );

    }

}


/* ==========================================
   打者表示
========================================== */

function showBatter(player) {

    setText(
        "team",
        "チーム：" +
        (player.team || "---")
    );


    setText(
        "position",
        "打者"
    );


    const target =
        document.getElementById(
            "bassStats"
        );


    if (!target) return;


    target.innerHTML = `

        <div class="card">

            <h3>⚾ BASS成績</h3>

            <div class="stat-grid">

                <div class="stat-item">
                    <span>打率</span>
                    <strong>
                        ${escapeHTML(
                            player.avg ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>OPS</span>
                    <strong>
                        ${escapeHTML(
                            player.ops ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>本塁打</span>
                    <strong>
                        ${escapeHTML(
                            player.hr ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>打点</span>
                    <strong>
                        ${escapeHTML(
                            player.rbi ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>打席</span>
                    <strong>
                        ${escapeHTML(
                            player.pa ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>安打</span>
                    <strong>
                        ${escapeHTML(
                            player.hit ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>出塁率</span>
                    <strong>
                        ${escapeHTML(
                            player.obp ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>長打率</span>
                    <strong>
                        ${escapeHTML(
                            player.slg ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>三振率</span>
                    <strong>
                        ${escapeHTML(
                            player.kRate ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>四球率</span>
                    <strong>
                        ${escapeHTML(
                            player.bbRate ?? "---"
                        )}
                    </strong>
                </div>

            </div>

        </div>

    `;

}


/* ==========================================
   投手表示
========================================== */

function showPitcher(player) {

    setText(
        "team",
        "チーム：" +
        (player.team || "---")
    );


    setText(
        "position",
        "投手"
    );


    const target =
        document.getElementById(
            "bassStats"
        );


    if (!target) return;


    target.innerHTML = `

        <div class="card">

            <h3>🔥 BASS成績</h3>

            <div class="stat-grid">

                <div class="stat-item">
                    <span>防御率</span>
                    <strong>
                        ${escapeHTML(
                            player.era ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>WHIP</span>
                    <strong>
                        ${escapeHTML(
                            player.whip ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>K/9</span>
                    <strong>
                        ${escapeHTML(
                            player.k9 ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>BB/9</span>
                    <strong>
                        ${escapeHTML(
                            player.bb9 ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>K/BB</span>
                    <strong>
                        ${escapeHTML(
                            player.kbb ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>FIP</span>
                    <strong>
                        ${escapeHTML(
                            player.fip ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>投球回</span>
                    <strong>
                        ${escapeHTML(
                            player.inning ?? "---"
                        )}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>奪三振</span>
                    <strong>
                        ${escapeHTML(
                            player.strikeout ?? "---"
                        )}
                    </strong>
                </div>

            </div>

        </div>

    `;

}


/* ==========================================
   JSON分析
========================================== */

function loadJSONAnalysis() {

    /*
     * BASS JSONから
     * この選手の打席データを取得
     */

    if (
        typeof getBatterByName !==
        "function"
    ) {

        console.warn(
            "getBatterByName() がありません。"
        );

        return;

    }


    const events =
        getBatterByName(
            playerName
        );


    if (
        !events ||
        events.length === 0
    ) {

        console.log(
            "この選手のJSONイベントはありません。"
        );

        return;

    }


    console.log(
        "Player events:",
        events.length
    );


    /*
     * 打球方向
     */

    createDirectionAnalysis(
        events
    );


    /*
     * 球種
     */

    createPitchTypeAnalysis(
        events
    );


    /*
     * カウント
     */

    createCountAnalysis(
        events
    );


    /*
     * コース
     */

    createCourseAnalysis(
        events
    );


    /*
     * ヒートマップ
     */

    if (
        typeof initHeatMap ===
        "function" &&
        typeof drawHeatMap ===
        "function"
    ) {

        initHeatMap();

        drawHeatMap(
            events
        );

    }


    /*
     * Spray Chart
     */

    if (
        typeof initSprayChart ===
        "function" &&
        typeof drawSprayChart ===
        "function"
    ) {

        initSprayChart();

        drawSprayChart(
            events
        );

    }

}


/* ==========================================
   打球方向
========================================== */

function createDirectionAnalysis(
    events
) {

    const data = {

        left: 0,

        center: 0,

        right: 0

    };


    events.forEach(event => {

        const direction =
            event?.batted_ball
                ?.direction_3_division;


        if (
            direction === "Left" ||
            direction === "left" ||
            direction === 1
        ) {

            data.left++;

        }

        else if (
            direction === "Center" ||
            direction === "center" ||
            direction === 2
        ) {

            data.center++;

        }

        else if (
            direction === "Right" ||
            direction === "right" ||
            direction === 3
        ) {

            data.right++;

        }

    });


    const target =
        document.getElementById(
            "directionData"
        );


    if (!target) return;


    target.innerHTML = `

        <div class="card">

            <h3>🗺 打球方向</h3>

            <div class="stat-grid">

                <div class="stat-item">
                    <span>レフト</span>
                    <strong>
                        ${data.left}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>センター</span>
                    <strong>
                        ${data.center}
                    </strong>
                </div>

                <div class="stat-item">
                    <span>ライト</span>
                    <strong>
                        ${data.right}
                    </strong>
                </div>

            </div>

        </div>

    `;


    /*
     * Chart.jsがある場合
     */

    const canvas =
        document.getElementById(
            "directionChart"
        );


    if (
        canvas &&
        typeof Chart !== "undefined"
    ) {

        if (
            window.directionChartInstance
        ) {

            window.directionChartInstance
                .destroy();

        }


        window.directionChartInstance =
            new Chart(
                canvas,
                {

                    type: "doughnut",

                    data: {

                        labels: [
                            "レフト",
                            "センター",
                            "ライト"
                        ],

                        datasets: [{

                            data: [
                                data.left,
                                data.center,
                                data.right
                            ]

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false

                    }

                }
            );

    }

}


/* ==========================================
   球種分析
========================================== */

function createPitchTypeAnalysis(
    events
) {

    const data = {};


    events.forEach(event => {

        const type =
            event?.pitch_type;


        if (!type) return;


        if (!data[type]) {

            data[type] = 0;

        }


        data[type]++;

    });


    const target =
        document.getElementById(
            "pitchTypeData"
        );


    if (!target) return;


    let html = `

        <div class="card">

            <h3>⚾ 球種割合</h3>

            <table class="stat-table">

                <thead>

                    <tr>
                        <th>球種</th>
                        <th>投球数</th>
                    </tr>

                </thead>

                <tbody>

    `;


    Object.keys(data)
        .forEach(type => {

            html += `

                <tr>

                    <td>
                        ${escapeHTML(type)}
                    </td>

                    <td>
                        ${data[type]}
                    </td>

                </tr>

            `;

        });


    html += `

                </tbody>

            </table>

        </div>

    `;


    target.innerHTML =
        html;

}


/* ==========================================
   カウント分析
========================================== */

function createCountAnalysis(
    events
) {

    const data = {};


    events.forEach(event => {

        const balls =
            event?.ball ??
            event?.ball_count ??
            0;


        const strikes =
            event?.strike ??
            event?.strike_count ??
            0;


        const count =
            `${balls}-${strikes}`;


        if (!data[count]) {

            data[count] = 0;

        }


        data[count]++;

    });


    const target =
        document.getElementById(
            "countData"
        );


    if (!target) return;


    let html = `

        <div class="card">

            <h3>📊 カウント別</h3>

            <table class="stat-table">

                <thead>

                    <tr>
                        <th>カウント</th>
                        <th>投球数</th>
                    </tr>

                </thead>

                <tbody>

    `;


    Object.keys(data)
        .forEach(count => {

            html += `

                <tr>

                    <td>
                        ${count}
                    </td>

                    <td>
                        ${data[count]}
                    </td>

                </tr>

            `;

        });


    html += `

                </tbody>

            </table>

        </div>

    `;


    target.innerHTML =
        html;

}


/* ==========================================
   コース分析
========================================== */

function createCourseAnalysis(
    events
) {

    const data =
        events.filter(event => {

            return (
                event?.course_x != null &&
                event?.course_y != null
            );

        });


    console.log(
        "Course events:",
        data.length
    );


    const target =
        document.getElementById(
            "courseData"
        );


    if (!target) return;


    target.innerHTML = `

        <div class="card">

            <h3>🎯 投球コース</h3>

            <p>
                コースデータ：
                ${data.length}球
            </p>

        </div>

    `;

}


/* ==========================================
   共通テキスト設定
========================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.innerText =
        value ?? "";

}


/* ==========================================
   エラー表示
========================================== */

function showError(
    message
) {

    const content =
        document.getElementById(
            "content"
        );


    if (!content) {

        console.error(
            message
        );

        return;

    }


    content.innerHTML = `

        <div class="card">

            <h2>⚠️ データエラー</h2>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}