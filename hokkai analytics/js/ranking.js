/* =====================================
HBAS Ranking
===================================== */

window.onload = async ()=>{

    await loadBatterStats();

    await loadPitcherStats();

    showRanking("avg");

}

function showRanking(type){

    let data=[];

    switch(type){

        case "avg":

            data=getAverageRanking();

            createBatterTable(data,"打率");

            break;

        case "ops":

            data=getOPSRanking();

            createBatterTable(data,"OPS");

            break;

        case "hr":

            data=getHomeRunRanking();

            createBatterTable(data,"本塁打");

            break;

        case "era":

            data=getERARanking();

            createPitcherTable(data,"防御率");

            break;

        case "so":

            data=getStrikeoutRanking();

            createPitcherTable(data,"三振");

            break;

    }

}

function createBatterTable(players,key){

    let html="";

    html += `
<table id="rankingTable">

<thead>

<tr>

<th>順位</th>

<th>選手</th>

<th>チーム</th>

<th onclick="sortRanking(3)">
${key} ▼
</th>

</tr>

</thead>

<tbody>
`;


    players.forEach((p,index)=>{

        html+=`

        <tr>

        <td>

<a href="#"

onclick="openPlayer('${p["打者"]}')">

${p["打者"]}

</a>

</td>
        </tr>

        `;

    });

    html+="</table>";

    document.getElementById("rankingList").innerHTML=html;

}

function createPitcherTable(players,key){

    let html="";

     html += `
<table id="rankingTable">

<thead>

<tr>

<th>順位</th>

<th>選手</th>

<th>チーム</th>

<th onclick="sortRanking(3)">
${key} ▼
</th>

</tr>

</thead>

<tbody>
`;

    players.forEach((p,index)=>{

        html+=`

        <tr>

        <td>

<a href="#"

onclick="openPlayer('${p["ピッチャー"]}')">

${p["ピッチャー"]}

</a>

</td>

        </tr>

        `;

    });

    html+="</table>";

    document.getElementById("rankingList").innerHTML=html;

}

/* =====================================
   検索
===================================== */

function searchRanking(){

    const keyword = document
        .getElementById("searchPlayer")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll("#rankingTable tbody tr");

    rows.forEach(row=>{

        const text=row.innerText.toLowerCase();

        if(text.includes(keyword)){

            row.style.display="";

        }else{

            row.style.display="none";

        }

    });

}

/* =====================================
   ソート
===================================== */

function sortRanking(column){

    const table=document.getElementById("rankingTable");

    const tbody=table.querySelector("tbody");

    const rows=[...tbody.querySelectorAll("tr")];

    rows.sort((a,b)=>{

        const av=a.children[column].innerText;

        const bv=b.children[column].innerText;

        return Number(bv)-Number(av);

    });

    tbody.innerHTML="";

    rows.forEach(r=>tbody.appendChild(r));

}

/* =====================================
   選手ページ
===================================== */

function openPlayer(name){

    location.href=
    `player.html?name=${encodeURIComponent(name)}`;

}
