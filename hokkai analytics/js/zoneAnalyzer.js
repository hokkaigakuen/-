/* ==========================================
   HBAS v3.0
   zoneAnalyzer.js
========================================== */


function createZoneAverage(events){

    const zone = {};

    for(let i = 1; i <= 9; i++){

        zone[i] = {

            hit: 0,
            ab: 0

        };

    }


    events.forEach(event => {

        const no = Number(event.course_number_9);

        if(!no) return;

        // 1〜9以外のデータは除外
        if(!zone[no]) return;

        zone[no].ab++;

        if(isHit(event.end_result_id)){

            zone[no].hit++;

        }

    });


    return zone;

}


/* ==========================================
   安打判定
========================================== */

function isHit(result){

    const hit = [

        "1B",
        "2B",
        "3B",
        "HR"

    ];

    return hit.includes(result);

}


/* ==========================================
   コース別打率
========================================== */

function drawZoneAverage(events){

    const zone = createZoneAverage(events);

    let html = "";

    html += "<table class='zoneAverage'>";


    for(let r = 0; r < 3; r++){

        html += "<tr>";


        for(let c = 1; c <= 3; c++){

            const no = r * 3 + c;

            const z = zone[no];

            let avg = "---";


            if(z.ab > 0){

                avg = (z.hit / z.ab).toFixed(3);

            }


            html += `

                <td
                    style="
                    background:${getZoneColor(avg)};
                    color:white;
                    ">

                    ${avg}

                </td>

            `;

        }


        html += "</tr>";

    }


    html += "</table>";


    const target = document.getElementById("zoneAverage");


    if(!target){

        console.error(
            "zoneAverageというIDのHTML要素が見つかりません。"
        );

        return;

    }


    target.innerHTML =
        html + createZoneLegend();

}


/* ==========================================
   打率 → 色
========================================== */

function getZoneColor(avg){

    if(avg === "---") return "#ffffff";

    avg = Number(avg);


    if(avg >= 0.500)
        return "#d32f2f";


    if(avg >= 0.400)
        return "#f57c00";


    if(avg >= 0.300)
        return "#fbc02d";


    if(avg >= 0.200)
        return "#7cb342";


    return "#1e88e5";

}


/* ==========================================
   凡例
========================================== */

function createZoneLegend(){

    return `

        <div class="zoneLegend">

            <div>
                <span style="background:#d32f2f"></span>
                .500以上
            </div>

            <div>
                <span style="background:#f57c00"></span>
                .400以上
            </div>

            <div>
                <span style="background:#fbc02d"></span>
                .300以上
            </div>

            <div>
                <span style="background:#7cb342"></span>
                .200以上
            </div>

            <div>
                <span style="background:#1e88e5"></span>
                .199以下
            </div>

        </div>

    `;

}