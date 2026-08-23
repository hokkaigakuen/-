/* ==========================================
   HGU Lab
   app.js
========================================== */


/* ==========================================
   データ
========================================== */

let batterData = [];
let pitcherData = [];

let gameData = [];
let hittingRapsodoData = [];
let pitchingRapsodoData = [];


/* ==========================================
   HTML
========================================== */

function getContent() {

    const content = document.getElementById("content");

    if (!content) {

        console.error(
            "id='content' のHTML要素が見つかりません。"
        );

        return null;
    }

    return content;
}


/* ==========================================
   初期読み込み
========================================== */

window.onload = async () => {

    console.log("HGU Lab 起動");


    try {

        await loadBatters();

    } catch (error) {

        console.error(
            "打者データの読み込みに失敗しました",
            error
        );

    }


    try {

        await loadPitchers();

    } catch (error) {

        console.error(
            "投手データの読み込みに失敗しました",
            error
        );

    }


    try {

        await loadGameJSON();

    } catch (error) {

        console.error(
            "ゲームJSONの読み込みに失敗しました",
            error
        );

    }


    try {

        await loadHittingRapsodo();

    } catch (error) {

        console.error(
            "打者Rapsodoの読み込みに失敗しました",
            error
        );

    }


    try {

        await loadPitchingRapsodo();

    } catch (error) {

        console.error(
            "投手Rapsodoの読み込みに失敗しました",
            error
        );

    }


    showHome();

};


/* ==========================================
   ホーム画面
========================================== */

function showHome() {

    const content = getContent();

    if (!content) return;


    content.innerHTML = `

        <div class="card">

            <div class="logo">

                <h1>HGU Lab</h1>

                <p>
                    HOKKAI GAKUEN UNIVERSITY LAB
                </p>

            </div>

            <p>
                北海学園大学 Baseball Analytics Lab
            </p>

        </div>


        <div class="grid">


            <div
                class="menu-card"
                onclick="showBatters()"
            >

                <h3>⚾ 打者</h3>

                <p>
                    打撃成績を見る
                </p>

            </div>


            <div
                class="menu-card"
                onclick="showPitchers()"
            >

                <h3>🔥 投手</h3>

                <p>
                    投手成績を見る
                </p>

            </div>


            <div
                class="menu-card"
                onclick="showRanking()"
            >

                <h3>🏆 ランキング</h3>

                <p>
                    選手ランキングを見る
                </p>

            </div>


            <div
                class="menu-card"
                onclick="showTeams()"
            >

                <h3>🏫 チーム</h3>

                <p>
                    チーム情報を見る
                </p>

            </div>


        </div>


        <div class="card">

            <h2>📊 データ概要</h2>

            <p>
                打者：
                ${batterData.length}
                人
            </p>

            <p>
                投手：
                ${pitcherData.length}
                人
            </p>

        </div>

    `;

}


/* ==========================================
   打者一覧
========================================== */

function showBatters() {

    const content = getContent();

    if (!content) return;


    let html = `

        <div class="card">

            <h2>⚾ 打者一覧</h2>

        </div>

    `;


    if (
        !batterData ||
        batterData.length === 0
    ) {

        html += `

            <div class="card">

                <p>
                    打者データがありません。
                </p>

            </div>

        `;

        content.innerHTML = html;

        return;
    }


    batterData.forEach(player => {

        const name =
            player["打者"] ??
            player["選手名"] ??
            player["player_name"] ??
            "名前なし";


        const avg =
            player["打率"] ??
            player["AVG"] ??
            "---";


        const ops =
            player["OPS"] ??
            "---";


        html += `

            <div
                class="player-card"
                onclick="openBatter('${escapeHTML(name)}')"
            >

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    打率：${escapeHTML(avg)}
                </p>

                <p>
                    OPS：${escapeHTML(ops)}
                </p>

            </div>

        '