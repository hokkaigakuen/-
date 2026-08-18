function drawStrikeZone(events) {
    const canvas = document.getElementById("zoneCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = 320;
    canvas.height = 360;

    ctx.clearRect(0,0, canvas.width, canvas.height);

    const zoneX = 85;
    const zoneY =60;
    const zoneSize =150;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";

    ctx.stroleRect(zoneX, zoneY, zoneSize, zoneSize);

    for(let i=1;i<3;i++){
        ctx.beginPath();
        ctx.moveTo(zoneX + zoneSize/3*i, zoneY);
        ctx.lineTo(zoneX + zoneSize/3*i, zoneY+zoneSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(zoneX, zoneY + zoneSize/3*i);
        ctx.lineTo(zoneX+zoneSize, zoneY+zoneSize/3*i);
        ctx.stroke();
    }
    events.forEath(event=>{
        if(event.course_x==null || event.course_y==null) return;
        const x = zoneX + (event.course_x+1.5)*(zoneSize/3);
        const y = zoneY + (1.5-event.course_y)*(zoneSize/3);

        ctx.beginPath();
        ctx.arc(x,y,4.0,Math.PI*2);
        ctx.fillStyle="red";
        ctx.fill();
    });
}