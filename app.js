var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;

const fullNode = new HttpProvider('https://api.trongrid.io');
const solidityNode = new HttpProvider('https://api.trongrid.io');
const eventServer = 'https://api.trongrid.io';

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    ''
)

const getAllEvents = async ()=>{
    let oDate = new Date();
    let timestamp = oDate.getTime() - 24 * 3600 * 1000;
    let address = 'TMYcx6eoRXnePKT1jVn25ZNeMNJ6828HWk';
    const success = await tronWeb.getEventResult(
        address,
        timestamp,
        "UserWin",
        0
    ).catch(e=>{
        console.log('win',e);
    });
    const fail = await tronWeb.getEventResult(
        address,
        timestamp,
        "UserLose",
        0
    ).catch(e=>{
        console.log('fail',e);
    });
    /*console.log(success);
    console.log(fail);*/
    let logs = success.concat(fail);
    logs.sort(function(a,b){
        return (b.block_timestamp - a.block_timestamp);
    })
    return logs;

    /*let logs = await Promise.all([success, fail]);
    console.log(logs);*/
    /*Promise.all([success, fail])
        .then(logs2 => {
            let logs;
            logs = logs2[0].concat(logs2[1]);
            logs = this.sort(logs, "timestamp");
            //logs = this.deworming(logs, "transaction");
            let a = [],
                b = [];
            logs.forEach((v,i) => {
                if(i<20){
                    const player = tronWeb.address.fromHex(
                        v.result["_addr"].replace(/^0x/, "41")
                    );
                    const select = v.result["_point"];
                    const result = v.result["_random"];
                    const input = tronWeb.fromSun(v.result["_amount"]);
                    const output = v.result["_W"]
                        ? tronWeb.fromSun(v.result["_W"])
                        : "0";
                    const time = v.timestamp;
                    const transactionId = v.transaction;

                    a.push({
                        select,
                        result,
                        player,
                        input,
                        output,
                        time,
                        transactionId
                    });
                }

            });
            this.all = a;

        })
        .catch(err => {
            console.log(err);
        });*/
}

server.listen(8081,()=>{
  console.log('listen on 8081');
});

app.get('/', async function (req, res) {
    res.send('welcome socket event server');
});

io.on('connection', async function (socket) {
    let logs = await getAllEvents().catch(e=>{console.log()});
    socket.emit('events', { logs: logs });
    setInterval(async ()=>{
        let logs = await getAllEvents();
        socket.emit('events', { logs: logs });
    },3000);
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

module.exports = app;
