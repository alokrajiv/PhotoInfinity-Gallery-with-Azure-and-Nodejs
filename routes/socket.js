module.exports = function(server) {

    var io = require('socket.io')(server);
    function BufferPipe() {
        this._maxSize = 10;
        this._storage = [];
    }

    BufferPipe.prototype.in = function(data) {
        var size = ++this._size;
        this._storage.push(data);
        if (this._storage.length > this._maxSize)
            this._storage.shift();
    };
    BufferPipe.prototype.show = function() {
        return this._storage;
    };
    //--end-->BufferPipe datatype


    var missions = [
        {
            id: 0,
            name: 'MISSION Microsoft Azure',
            descr: 'Survey?',
            logo: 'images/ben.png',
            messagePipe: new BufferPipe()
        },
        {
            id: 1,
            name: 'MISSION Elon Musk',
            descr: 'AMA (Q/A)',
            logo: 'images/max.png',
            messagePipe: new BufferPipe()
        },
        {
            id: 2,
            name: 'MISSION Startup Weekend',
            descr: '2 Questions',
            logo: 'images/adam.jpg',
            messagePipe: new BufferPipe()
        },
        {
            id: 3,
            name: 'MISSION UAE',
            descr: 'Expo 2020 New Ideas!',
            logo: 'images/mike.png',
            messagePipe: new BufferPipe()
        }
    ];

    io.on('connection', function(socket, io) {
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
    });


}