<template>
  <div>
    <el-card class="carrd">
      <div class="message-container">
        <div v-for="msg in msgList" :key="msg.id" class="gg">
          <div v-if="msg.includes('####')" class="right">
            {{ msg.split('::')[1] }}
          </div>
          <div v-else class="left">
            {{ msg.split('::')[1] }}
          </div>
        </div>
      </div>
      <textarea class="inputs" type="text" v-model="message.groupId" placeholder="groupID"/>
      <textarea class="inputs" type="text" v-model="message.myMsg" placeholder="myMsg"/>
      <el-button type="primary" class="boxinput" v-on:click="send">Send</el-button>
      <div>
        <el-button type="default" @click="sendmessage">Create GroupChat</el-button>
      </div>
      <el-dialog v-model="getMessage">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item>
            <el-input v-model="groupID" placeholder="群ID"></el-input>
          </el-form-item>
          <el-form-item label="收件人：">{{ memberList.toString().replace("[", '').replace(']', '') }}
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="memberOne" placeholder="用户ID:" style="margin-top: 10px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addOne" style="float:right">添加</el-button>
            <el-button type="primary" @click="cGroup" style="float:right">创建</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {useStore} from 'vuex'

export default {
  setup() {
    const store = useStore()  // 该方法用于返回store 实例
    console.log(store)  // store 实例对象
    return {store}
  },
  name: "ChatPage",
  created() {
    console.log('created')
    this.initWebSocket()
  },
  data() {
    return {
      getMessage: false,
      message: {
        groupId: -1,
        destinationUserId: '',
        destinationRegistrationId: '',
        myMsg: '',
        time: '',
      },
      websocket: null,
      recvMsg: {},
      msgList: [],
      memberList: [],
      memberOne: '',
      groupID: '',
      msg: ''
    }
  },
  methods: {
    addOne() {
      this.memberList.push(this.memberOne);
      this.memberOne = '';
    },
    cGroup() {
      this.memberList.push(this.groupID)
      this.$http.post('/createGroup', {
        // groupId: this.groupID,//群聊ID，就用这个来识别群聊，应该吧，或者还要生成RID啥的
        groupMember: this.memberList,//字面意思，list里是昵称
        // userId: this.message.destinationUserId//记录创群人是谁，可有可无
      }).then(async e => {
        console.log(e.data);
      })
      this.groupID = '';
      this.memberList = [];
    },
    sendmessage() {
      this.getMessage = true;
    },
    send() {
      console.log('send')
      if (this.message.groupId !== -1) {
        this.$http.post('/groupOrIndividual', {
          groupId: this.message.groupId,
          // userId: this.message.destinationUserId
        }).then(async e => {
          this.message.time = Date.now();
          console.log(this.message.time);
          this.msgList.push("####::" + this.message.myMsg);
          for (const key in e.data) {
            alert(key)
            let getBundleResult = await this.store.dispatch('get-key-bundle-of', key);
            if (getBundleResult) {

              this.message.destinationUserId = key;
              this.message.destinationRegistrationId = e.data[key];
              let cipherText = await this.store.dispatch('encrypt-message', this.message);
              alert(1)
              await this.websocketSend(JSON.stringify(cipherText));
            }
            alert('ok')
          }
          this.message.myMsg='';
        })
      } else {
        console.log(this.message.myMsg);
        this.$http.post('/groupOrIndividual', {
          groupId: -1,
          userId: this.message.destinationUserId
        }).then(async e => {
          // alert(key+' '+e.data[key])
          for (const key in e.data) {
            console.log(this.message.destinationUserId);
            console.log(this.message.myMsg);
            // alert(key+' '+e.data[key])
            let getBundleResult = await this.store.dispatch('get-key-bundle-of', key);
            if (getBundleResult) {
              this.message.destinationUserId = key;
              this.message.destinationRegistrationId = e.data[key];
              this.message.groupId = -1;
              this.message.time = Date.now();
              console.log(this.message.time);
              this.msgList.push("####::" + this.message.myMsg);
              let cipherText = await this.store.dispatch('encrypt-message', this.message);
              this.message.myMsg = '';
              await this.websocketSend(JSON.stringify(cipherText));
            }
          }
        })
      }
    },
    get() {
      this.$http.get('/keyOf/' + this.message.destinationUserId)
          .then(response => {
            console.log((response));
            this.recvMsg = response.data;
            this.store.dispatch('process-key', response.data)
                .then(res => {
                  if (res === true) {
                    console.log("ok");
                    return 'ok';
                  }
                });
          })

    },
    // onConfirm() {
    //   //需要传输的数据
    //   let data = {
    //     code: 1,
    //     item: '传输数据'
    //   }
    //   this.websocketSend(JSON.stringify(data))
    // },
    initWebSocket() { // 初始化websocket
      let url = 'ws://localhost:9090/websocket/' + this.store.getters.getUserId;
      // alert(url)
      this.websock = new WebSocket(url);
      this.websock.onmessage = this.websocketOnMessage
      this.websock.onerror = this.websocketOnError
      this.websock.onclose = this.websocketClose
    },
    // websocketOnOpen() { // 连接建立之后执行send方法发送数据
    //   let data = {
    //     code: 0,
    //     msg: {
    //       userId: this.store.getters.getUserId,
    //       registrationId: this.store.getters.getRegistrationId,
    //     }
    //   }
    //   // alert('post' + JSON.stringify(data))
    //   // this.websocketSend(JSON.stringify(data))
    // },
    websocketOnError() {
      console.log('WebSocket连接失败')
    },
    websocketOnMessage(e) { // 数据接收
      // alert('receive' + JSON.parse(e.data))
      // console.log(e);
      // console.log('数据接收' + e.data)
      let newMsg = JSON.parse(e.data);
      // alert(newMsg)
      console.log(newMsg);
      console.log("prepare to decrypt")
      // this.store.dispatch('check-info')
      this.store.dispatch('decrypt-message', newMsg)
          .then(res => {
            console.log(res);
            this.msg = res;
            this.msgList.push("###::" + res);
          });
      // console.log(decrypted);
      // alert('你有新消息'+ decrypted);
    },
    websocketSend(Data) { // 数据发送
      this.websock.send(Data)
      // alert('send' + Data)

    },
    websocketClose(e) {  // 关闭
      console.log('已关闭连接', e)
    },
    onStore() {
      this.store.dispatch('store-info')
          .then(resCode => {
            console.log(resCode);
          });
    },
    onCheck() {
      this.store.dispatch('check-info', this.message.destinationUserId)
          .then(resObj => {
            console.log(resObj);
          });
    },
    onDelete() {
      this.store.dispatch('delete-info', this.message.destinationUserId)
          .then(res => {
            console.log(res);
          })
    }
  },
}
</script>

<style scoped>
.left {
  width: 100%;
  float: left;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 90%;
  padding: 20px;
  border-radius: 20px 20px 20px 5px;
  background-color: rgb(56, 60, 75);
  color: #fff;
}

.right {
  width: auto;
  float: right;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  max-width: 90%;
  padding: 20px;
  border-radius: 20px 20px 5px 20px;
  background-color: rgb(29, 144, 245);
  color: #fff;
  word-wrap: break-word;
}

.boxinput {
  width: 50px;
  height: 50px;
  float: bottom;
  background-color: rgb(66, 70, 86);
  border-radius: 15px;
  border: 1px solid rgb(80, 85, 103);
  position: relative;
  cursor: pointer;
}

.inputs {
  width: 90%;
  height: 50px;
  float: bottom;
  background-color: rgb(66, 70, 86);
  border-radius: 15px;
  border: 2px solid rgb(34, 135, 225);
  padding: 10px;
  box-sizing: border-box;
  transition: 0.2s;
  font-size: 20px;
  color: #fff;
  font-weight: 100;
}

.carrd {
  width: 80vw;
  height: 80vh;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.message-container {
  height: 420px; /* 设置容器的高度，根据需要进行调整 */
  overflow-y: auto; /* 添加垂直滚动条 */
}
.gg{
  width:500px;
}
</style>
