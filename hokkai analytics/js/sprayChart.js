let sprayCanvas;
let sprayCtx;
function initSprayChart(){
    sprayCanvas = document.getElementById("sprayCanvas");
    if(!sprayCanvas) return;
    sprayCtx = sprayCanvas.getContext("2d");
    sprayCanvas.width = 500;
    sprayCanvas.height = 500;
}
function drawSprayChart(events){
    if(!sprayCtx) return;
    sprayCtx.clearRect(0,0,500,500);
    drawField();
    drawHits(events);
}

function drawField(){
    const cx = 250;
    const cy =420;
    sprayCtx.strokeStyle="#444";
    sprayCtx.lineWidth=2;

    sprayCtx.beginPath();
    sprayCtx.movieTo(cx,cy);
    sprayCtx.lineTo(90,120);
    sprayCtx.stroke();

    sprayCtx.beginPath();
    sprayCtx.moneTo(cx,cy);
    sprayCtx.lineTo(410,120);
    sprayCtx.stroke();

    sprayCtx.beginPath();
    sprayCtx.arc(
        cx,
        cy,
        320,
        Math.PI,
        2*Math.PI,
    );
    sprayCtx.stroke();
}

function drawHits(events){
    events.forEath(event=>{
        if(!event.batted_ball) return;
        const angle =
        Number(event.batted_ball.direction_angle);
        const distance =
        Number(event.batted_ball.hit_distance);
        if(isNaN(angle)||isNaN(distance)) return;
        const r=Math.min(distance,120);
        const rad=(angle-90)*(Math.PI/180);
        const x=250+r*Math.cos(rad);
        const y=420-r*Math.sin(rad);
        sprayCtx.beginPath();
        sprayCtx.arc(
            x,
            y,
            4,
            0,
            Math.PI*2
        );
        sprayCtx.fillStyle=getExitColor(
            event.batted_ball.exit_velocity
        );
        sprayCtx.fill();
    });
}

function getExitColor(ev){
    ev=Number(ev);
    if(isNaN(ev)) return "#888";
    if(ev>=100) return "#d50000";
    if(ev>=95) return "#ff6d00";
    if(ev>=90) return "#ffed3b"
    if(ev>=80) return "#4caf50"
    return "#42a5f5";
}