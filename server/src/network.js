
const TrainTask = require("./task").TrainTask
const response = require("./response")
const util = require("./util")

const ID_LENGTH = 8;

const CLIENT_TYPE = {
    observer: "observer",
    trainer: "trainer"
}

const result = {
    taskIDNotFound: -1
}

exports.result = result;

exports.Session = class Session {
    constructor() {
        this.clients = {};
        this.IDList = { observer: [], trainer: [] };
        this.trainTasks = {};
    }

    // セッションに参加
    join(client, role) {

        // length 文字のランダムな文字列を生成
        id = util.makeRandomStr(ID_LENGTH)

        // idと関連付けてクライアントを保存
        this.clients[id] = { obj: client, role: role, taskID: null };
        this.IDList[role].append(id);
        return id;

    }

    // 各observerにメッセージ送信
    broadcast(message) {
        this.IDList[CLIENT_TYPE.trainer].forEach((id) => this[id].send(message), this.IDList[CLIENT_TYPE.trainer])
    }

    //学習タスクを開始
    startTrainTasks(trainerID, taskName, params) {
        if (this.IDList[CLIENT_TYPE.trainer].include(trainerID)) {
            return null;
        }
        taskID = util.makeRandomStr(ID_LENGTH)
        this.trainTasks[taskID] = new TrainTask(taskName, params, trainerID);
        this.clients[trainerID].taskID = taskID
    }

    updateTrainTasks(taskID, params) {
        this.trainTasks[taskID].update(params)
    }

    endTrainTasks(taskID, status, params) {
        this.trainTasks[taskID].end(status, params)
        this.clients[trainerID].taskID = null
    }

    getTaskList() {
        return Object.keys(this.trainTasks)
    }

    getTask(taskID) {
        if (taskID in this.trainTasks) {
            return this.trainTasks[taskID].data();
        } else {
            return result.taskIDNotFound;
        }
    }
};