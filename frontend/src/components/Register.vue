<template>
  <div>
    <el-card class="card">
    Username: <el-input type="text" v-model="loginInfo.userID" placeholder="Input username"/>
    <br><br>
    Password: <el-input type="text" v-model="loginInfo.password" placeholder="Input pwd"/>
    <br><br>
    <el-button type="default" v-on:click="register">Register</el-button>
    <br><br>
    </el-card>
    <p>{{ this.store.state.registrationId }}</p>
  </div>
</template>

<script>
import {useRouter} from "vue-router";
import router from "@/router";
import {useStore} from "vuex";

export default {
  setup() {
    const store = useStore()  // 该方法用于返回store 实例
    console.log(store)  // store 实例对象
    const router = useRouter();
    return {store};
  },
  name: "Register",
  data() {
    return {
      loginInfo: {
        userID: '',
        password: '',
        registrationID: '',
      },
      responseResult: [],
    }
  },
  methods: {
    register() {
      this.$http.post('/register', {
        username: this.loginInfo.userID
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.store.dispatch('registration', this.loginInfo.userID).then(
              res => {
                console.log(`res: ${res}`);
                this.store.dispatch('store-info');
                this.$http.post('/register1', {
                  username: this.loginInfo.userID,
                  password: this.loginInfo.password,
                  registrationID: res.registrationId,
                }).then(successResponse => {
                  if (successResponse.data.code === 200) {
                    this.store.dispatch('send-keys-to-server')
                        .then(res => {
                          if (res === 'ok') {
                            alert('registered successfully!')
                            router.replace('/login');
                          }
                        })
                  } else {
                    alert("strange error")
                  }
                })
              }
          )
        } else if (successResponse.data.code === 406) {
          alert('Invalid user name!')
        } else {
          alert('User already exists!')
        }
      })
    }
  },
}
</script>

<style>
.card {
  width: 50%;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
