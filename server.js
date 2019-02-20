var io = require('socket.io')(80)

// Sockets 存放 uid 以及对应的socket实例
var Sockets = {};
// room 存放 rmmoId 以及对应的用户信息 (uid...)
var room = {};
io.sockets.on('connection', function(socket) {
    let roomInfo = {};
    let uid = socket.handshake.query.uid;
    Sockets[uid] = {};
    Sockets[uid]["socket"] = socket;
    console.log("建立连接", socket.handshake.query.uid);
    // Sockets.push(temp);
    let roomId = Math.floor(Math.random() * 100000) + 900000;
    console.log("rmmoId", roomId);
    room[roomId] = [];
    room[roomId].push({uid: uid})
    socket.join(roomId);
    Sockets[uid]["roomId"] = roomId;
    //广播所有用户房间信息更换
    sendRoomList();
    // 接收客户端发来的消息
    socket.on("SendMessage", SendMessage);
    //客户端发送断线消息
    socket.on("disconnection", disconnection);
})

function SendMessage(data) {
    console.log("接受消息",JSON.parse(data));
    let obj = JSON.parse(data);
    let msg = obj.msg;
    switch (msg) {
        case "sendmessage":
            message(obj.data, obj.uid);
            break;
        case "joinroom": 
            joinRoom(obj.roomId, obj.uid);
            break;
        case "roommessage": 
            roomMessage(obj.data, obj.uid);
            break;
    }
}
// 给指定ID房间的所有人发送消息
function roomMessage(data, uid) {
    console.log("发送消息", data, uid);
    let roomId = Sockets[uid]["roomId"];
    if (roomId) {
        console.log("房间号: ", roomId)
        let obj = {};
        let str = "房间ID:" + roomId + uid + ":" + data;
        obj.data = str;
        obj.uid = uid;
        obj.msg = "message";
        io.to(roomId).emit("message", JSON.stringify(obj))
    } else {
        console.log("房间号不存在!");
    }
}
// 对大厅所有人发送消息
function message(data, uid) {
    console.log("发送消息", data, uid);
    Object.keys(Sockets).map(item => {
        let obj = {};
        let str = uid + ":" + data;
        obj.data = str;
        obj.uid = uid;
        obj.msg = "message";
        console.log("uid", item);
        Sockets[item]["socket"].emit("message", JSON.stringify(obj));
    })
}
// 将用户加入指定房间
function joinRoom(roomId, uid) {
    console.log("加入房间: ", roomId, uid);
    let temp = room[roomId];
    if (temp.length > 0) {
        temp.push({uid: uid});
        Sockets[uid]["socket"].join(roomId);
        Sockets[uid]["roomId"] = roomId;
    } else {
        console.log("房间不存在", roomId);
    }
}
function disconnection(uid) {
    console.log("断开连接", uid);
    Sockets[uid].socket.disconnect(true);
    cleanRoom(Sockets[uid].roomId, uid);
    delete Sockets[uid];
}
/**
 * 清除房间中指定userId用户
 * @param {number} roomId 房间ID
 * @param {number} uid  用户userId
 */
function cleanRoom (roomId, uid) {
    console.log("~~~~~~~清理房间掉线用户~~~~~~~~");
    if (room[roomId].length < 0) return;
    // 这里用map不太好 每次都会遍历房间列表 
    room[roomId].map((item, index, arr) => {
        if (item.uid == uid) {
            console.log("删除用户", uid);
            arr.splice(index, 1);
            Sockets[uid].socket.leave(roomId, () => {
               console.log("离开房间成功", uid, roomId);
            })
        }
    })
    if (room[roomId].length == 0) delete room[roomId];
    console.log("room[uid]", room[roomId]);
}
/**
 * 广播所有用户 更新房间列表
 */
function sendRoomList() {
    console.log("~~~~~~~更新房间列表~~~~~~~~");
    broadcast(room, "roomlist");
}
/**
 * 广播所有用户
 * 传递信息
 */
function broadcast(data, msg) {
    console.log("~~~~~~~~~广播所有用户~~~~~~~~~~", msg, data);
    Object.keys(Sockets).map(item => {
        let obj = {};
        obj.data = data;
        obj.msg = msg;
        Sockets[item]["socket"].emit("message", JSON.stringify(obj));
    })
}
