module.exports = function(socket) {
    socket.on('requestDataMissions', function(data, callback) {
        var missionsToSend = [];
        missions.forEach(function(mission) {
            missionsToSend.push({
                id: mission.id,
                name: mission.name,
                descr: mission.descr,
                logo: mission.logo,
            })
        })
        callback({}, { data: missionsToSend });
    });
    socket.on('requestDataMissionChat', function(data, callback) {
        for (var i = 0; i < missions.length; i++) {
            console.warn(missions[i]);
            if (missions[i].id == data.missionId) {
                var data = missions[i].messagePipe.show();
                callback({}, { data: data });
                break;
            }
        }
    });
    socket.on('requestStoreMission', function(data, callback) {
        var tmp = data.mission;
        tmp.messagePipe = new BufferPipe();
        console.warn(tmp);
        missions.push(tmp);
        callback({}, { status: 'ok' });
        io.emit('refreshChannel', { label: 'missionsList' });
    });
    socket.on('requestRemoveMission', function(data, callback) {
        var id = data.mission.id;
        for (var i = 0; i < missions.length; i++) {
            if (missions[i].id == id) {
                var res = { status: 'fail' };
                if (i > -1) {
                    missions.splice(i, 1);
                    res.status = 'ok';
                }
                callback({}, { status: 'ok' });
                io.emit('refreshChannel', { label: 'missionsList' });
                break;
            }
        }
    });
    socket.on('channel1', function(data) {
        socket.broadcast.emit('channel1', data);
        for (var i = 0; i < missions.length; i++) {
            if (missions[i].id == data.missionId) {
                missions[i].messagePipe.in(data);
                break;
            }
        }
    });
}