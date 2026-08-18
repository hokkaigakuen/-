const content = docoment.getElementById("content");
let batterDate =[];
let pitcherDate = [];

window.onload = async () => {
    await loadBatters();
    await loadPitchers();
    await loadGameJSON();
    await loadHittingRapsodo();
    await loadPitchingRapsodo();
    showHome();
}

function showPage(){
content.innerHTML = '
<div class="card">
<h2>HGAS</h2>
<p>
北海学園大学 Baseball Analytics System
</p>
</div>
<div class="grid">
<div class="menu-card"onclick="showBatters()">
<h3>打者</h3>
<p>打撃成績を見る</p>
</div>
<div class="menu-card"onclick="showPitchers()">
    <h3>投手</h3>
    <p>投手成績を見る</p>
    </div>
<div class="menu-card">
    <h3>ランキング</h3>
    <p>準備中</p>
</div>
<div class="menu-card">
    <h3>チーム</h3>
    <p>準備中</p>
    </div>
    </div>
    ;
}

function showBatters(){
    let html = <h2>打者一覧</h2>';
    batterDate.forEach(player=>{
        html += '
    <div class="player-card"
    onclick="openBatter(${player["打者"]}')>
    <h3>${player["打者"]}</h3>
    <p>打率 ${player["打率"]}</p>
    <p>OPS ${player["OPS"]}</p>
    </div>
    ';
    });
content.innerHTML = html;
}

unction showPitchers(){
    let html = <h2>投手一覧</h2>';
    pitcherDate.forEach(player=>{
        html += '
    <div class="player-card"
    onclick="openPitcher(${player["投手"]}')>
    <h3>${player["投手"]}</h3>
    <p>防御率 ${player["防御率"]}</p>
    <p>WHIP ${player["WHIP"]}</p>
    </div>
    ';
    });
content.innerHTML = html;
}