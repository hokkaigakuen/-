function openBatter(name){
    const player = batterData.find(p=>p["打者"]===name);
    if(!player) {
        alert("選手が見つかりません");
    return;
    }
    const html = '
    <div class="player-page">
        <button class="back-btn"
        onclick="showBatters()">
        ← 一覧へ戻る
        </button>
        <div class="player-header">
            <div>
            <h2>${player["打者"]}</h2>
            <p>${player["チーム"]}</p>
            </div>
        </div>
        <div class="section">
            <h2> BASS成績</h2>
            <table class="stat-table">
                <tr>
                    <td>試合数</td>
                    <td>${player["試合数"]}</td>
                </tr>
                <tr>
                    <td>打席</td>
                    <td>${player["打席"]}</td>
                </tr>
                <tr>
                    <td>打数</td>
                    <td>${player["打数"]}</td>
                </tr>
                <tr>
                    <td>安打</td>
                    <td>${player["安打"]}</td>
                </tr>
                <tr>
                    <td>二塁打</td>
                    <td>${player["2塁打"]}</td>
                </tr>
                <tr>
                    <td>3塁打</td>
                    <td>${player["3塁打"]}</td>
                </tr>
                <tr>
                    <td>本塁打</td>
                    <td>${player["打点"]}</td>
                </tr>
                <tr>
                    <td>盗塁</td>
                    <td>${player["四球"]}</td>
                </tr>
                <tr>
                    <td>四球</td>
                    <td>${player["四球"]}</td>
                </tr>
                <tr>
                    <td>死球</td>
                    <td>${player["死球"]}</td>
                </tr>
                <tr>
                    <td>三振</td>
                    <td>${player["三振"]}</td>
                </tr>
                <tr>
                    <td>犠打</td>
                    <td>${player["犠打"]}</td>
                </tr>
                <tr>
                    <td>犠飛</td>
                    <td>${player["犠飛"]}</td>
                </tr>
                <tr>
                    <td>打率</td>
                    <td>${player["打率"]}</td>
                </tr>
                <tr>
                    <td>出塁率</td>
                    <td>${player["出塁率"]}</td>
                </tr>
                <tr>
                    <td>長打率</td>
                    <td>${player["長打率"]}</td>
                </tr>
                <tr>
                    <td>OPS</td>
                    <td>${player["OPS"]}</td>
                </tr>
                <tr>
                    <td>IsoP</td>
                    <td>${player["IsoP"]}</td>
                </tr>
                <tr>
                    <td>BSBIP</td>
                    <td>${player["BSBIP"]}</td>
                </tr>
                <tr>
                    <td>K%</td>
                    <td>${player["三振率"]}</td>
                </tr>
                <tr>
                    <td>BB%</td>
                    <td>${player["四球率"]}</td>
                </tr>
            </table>
        </div>
        <div id="rapsodoArea"></div>
        <div id="blastArea"></div>
        <div id="jsonArea"></div>
</div>
';
content.innerHTML = html;
const hit = getHittingSummary();
if(hit){
    document.getElementById("rapsodoArea").innerHTML =
    <table class="stat-table">
        <tr>
            <td>平均打球速度</td>
            <td>${hit.avgEV} mph</td>
        </tr>
        <tr>
            <td>最大打球速度</td>
            <td>${hit.maxEV} mph</td>
        </tr>
        <tr>
            <td>平均打球角度</td>
            <td>${hit.avgLA} °</td>
        </tr>
    </table>
    ‘;
}
loadRapsodo(name);
loadBlast(name);
loadJsonAnalysis(name);


        <div class="card">
            <h3>Rapsodo</h3>
            <div id="rapsodoArea"></div>
                読み込み予定
        </div>
        <div class="card">
            <h3>Blast</h3>
            <div id="blastData"></div>
                読み込み予定
        </div>
        <div class="card">
            <h3>JSON解析</h3>
            <div id="jsonData"></div>
        </div>
        initHeatMap();
        drawHeatMap(events);
        <div class="card">
            <h2>Spray Chart</h2>
            <canvas id="sprayCanvas"></canvas>
        </div>
        <div class="card">
            <h2>投球コース</h2>
            <canvas id="heatmapCanvas"></canvas>
        </div>
        <div class="card">
            <h3>投球コース</h3>
            <canvas id="zoneCanvas"></canvas>
        </div>
        <div class="card">
            <h3>打球方向</h3>
            <canvas id="directionChart"></canvas>
        </div>
        <div class="card">
            <h3>球種割合</h3>
            <canvas id="pitchChart"></canvas>
        </div>
    </div>
    ';
    content.innerHTML = html;
    const direction = getHitDirection(name);
    const pitchTypes = getPitchTypes(name);
    const counts = getCountStats(name);
    const course = getCourse(name);
    drawStrikeZone(course);
    const jsonDiv = document.getElementById("jsonData");
    jsonDiv.innerHTML = 
    createDirectionChart(direction);
    createPitchChart(pitchTypes);
    <h4>打球方向</h4>
    <table class="stat-table">
    <tr>
        <td>レフト</td>
        <td>${direction.left}</td>
    </tr>
    <tr>
        <td>センター</td>
        <td>${direction.center}</td>
    </tr>
    </table>
    <br>
    <h4>球種割合</h4>
    <table class="stat-table">
        ${Objest.keys(pitchTypes).map(type=>'
        <tr>
        <td>${type}</td>
        <td>${pitchTypes[type]}</td>
        </tr>
        ').json("")}
        </table>
        <br>
        <h4>カウント別</h4>
        <table class="stat-table">
            ${Object.keys(counts).map(count=>'
            <tr>
            <td>${count}</td>
            <td>${counts[count]}</td>
            </tr>
            ').json("")}
            </table>
            ';
}

/* ==========================================
   HBAS v3.0
   player.js
========================================== */

let playerName = "";

/* URL取得 */

function getPlayerName(){

    const params = new URLSearchParams(location.search);

    playerName = params.get("name");

    if(!playerName){

        playerName = "選手名";

    }

    return playerName;

}

window.onload = async function(){

    playerName = getPlayerName();

    document.getElementById("playerName").innerText = playerName;

    document.getElementById("name").innerText = playerName;

    await loadBatterStats();
    await loadPitcherStats();

    await loadRapsodo();
    await loadBlast();

    await loadBACS("data/bacs/game.json");

    loadPlayer();

}

function loadPlayer(){

    const batter = getBatterSummary(playerName);

    const pitcher = getPitcherSummary(playerName);

    if(batter){

        showBatter(batter);

    }

    if(pitcher){

        showPitcher(pitcher);

    }

    loadJSON();

}

function showBatter(player){

    document.getElementById("team").innerHTML =
        "チーム：" + player.team;

    document.getElementById("position").innerHTML =
        "打者";

    document.getElementById("bassStats").innerHTML =

    `
    <table class="statTable">

    <tr>

    <th>打率</th>

    <th>OPS</th>

    <th>本塁打</th>

    <th>打点</th>

    </tr>

    <tr>

    <td>${player.avg}</td>

    <td>${player.ops}</td>

    <td>${player.hr}</td>

    <td>${player.rbi}</td>

    </tr>

    </table>

    `;

}

function showPitcher(player){

    document.getElementById("team").innerHTML =
        "チーム：" + player.team;

    document.getElementById("position").innerHTML =
        "投手";

    document.getElementById("bassStats").innerHTML =

    `
    <table class="statTable">

    <tr>

    <th>防御率</th>

    <th>WHIP</th>

    <th>K/9</th>

    <th>FIP</th>

    </tr>

    <tr>

    <td>${player.era}</td>

    <td>${player.whip}</td>

    <td>${player.k9}</td>

    <td>${player.fip}</td>

    </tr>

    </table>

    `;

}

function loadJSON(){

    const events=getBatterByName(playerName);

    if(events.length===0){

        return;

    }

    initHeatMap();

    drawHeatMap(events);

    initSprayChart();

    drawSprayChart(events);

    destroyCharts();

    drawDirectionChart(events);

    drawPitchChart(events);

    createZoneTable(events);

}

.statTable{

    width:100%;

    border-collapse:collapse;

}

.statTable th{

    background:#1565C0;

    color:white;

    padding:12px;

}

.statTable td{

    text-align:center;

    padding:12px;

    border-bottom:1px solid #ddd;

}

drawZoneAverage(events);