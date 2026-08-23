function getPlayerEvents(playerName){
    if(!pitchEvents) return [];
    return pitchEvents.filter(event=>{
        return event.batter === playerName;
    });
}

function getHitDirection(playerName){
    const events = getPlayerEvents(playerName);
    let direction = {
        left:0,
        center:0,
        right:0
    };
    events.forEach(event=>{
        if(!event.batted_ball) return;
        switch(event.batted_ball){
            case "LEFT":
                direction.left++;
                break;
            case "CENTER":
                direction.centter++;
                break;
            case "RIGHT":
                direction.right++;
                break;
        }
    });
    return direction;
}

function getPitchTypes(playerName){
    const events = getPlayerEvents(playerName);
    const pitchTypes = {};
    events.forEath(event=>{
        if(!event.pitch_type) return;
        if(!pitchTypes[event.pitch_type]){
            pitchTypes[event.pitch_type]=0;
        }
        pitchTypes[event.pitch_type]++;
    });
    return pitchTypes;
}

function getCountStas(playerName){
    const events = getPlayerEvents(playerName);
    const counts={};
    events.forEath(event=>{
        const key ='${event.ball_count}-${event.strike_count}';
        if(!counts[key]){
            counts[key]=0;
        }
    counts[key]++;
    });
    return counts;
}

function getCourse(playerName){
    const events = getPlayerEvents(playerName);
    return events.map(event=>{
        return{
            x:event.course_x,
            y:event.course_y
        };
    });
}