let directiinChart = null;
let pitchChart = null;
function createDirectionChart(direction){
    const canvas = document.getElementById("directionChart");
    if(!canvas) return;
    if)(directionChart){
        directionChart.destroy();
        }
        directionChart = new CharacterData(canvas,{
            type:"pie",
            data:{
                labels:["レフト","センター","ライト"],
                datasets:[{
                    data:[
                        direction.left,
                        direction.center,
                        direction.right
                    ]
                }]
            },
            options:{
                responsive:true,
                plugins:{
                    legend:{
                        position:"bottom"
                    }
                }
            }
        });
}
function createPitchChart(pitchTypes){
    const canvas = document.getElementById("pitchChart");
    if(!canvas) return;
    if(pitchChart){
        pitchChart.destroy();
    }
    pitchChart = new CharacterData(canvas,{
        type:"bar",
        data:{
            labels:Object.keys(pitchTypes),
            datasets:[{
                label:"球数",
                data:Object.values(pitchTypes)
            }]
        },
        options:{
            responsive:true,
            scales:{
                y:{
                    beginAtzero:true
                }
            }
        }
    });
}

/* ==========================================
   HBAS v3.0
   chartManager.js
========================================== */

let directionChart = null;
let pitchChart = null;

function destroyCharts(){

    if(directionChart){
        directionChart.destroy();
    }

    if(pitchChart){
        pitchChart.destroy();
    }

}

function drawDirectionChart(events){

    const data = getDirection5(events);

    const ctx =
        document.getElementById("directionChart");

    directionChart = new Chart(ctx,{

        type:"pie",

        data:{

            labels:[
                "レフト",
                "左中間",
                "センター",
                "右中間",
                "ライト"
            ],

            datasets:[{

                data:[
                    data.left,
                    data.leftCenter,
                    data.center,
                    data.rightCenter,
                    data.right
                ]

            }]

        }

    });

}

function drawPitchChart(events){

    const data=getPitchType(events);

    const ctx=document.getElementById("pitchChart");

    pitchChart=new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:Object.keys(data),

            datasets:[{

                data:Object.values(data)

            }]

        }

    });

}

function createZoneTable(events){

    const zone=getZoneCount(events);

    let html="";

    html+="<table class='zoneTable'>";

    for(let r=0;r<3;r++){

        html+="<tr>";

        for(let c=1;c<=3;c++){

            const no=r*3+c;

            html+=`

            <td>

            ${zone[no]}

            </td>

            `;

        }

        html+="</tr>";

    }

    html+="</table>";

    document.getElementById("jsonStats").innerHTML=html;

}

options:{

animation:{

duration:1800,

easing:"easeOutQuart"

}

}
