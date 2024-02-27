<template>
  <div>
    <el-card class="card">
    Username: <el-input type="text" v-model="loginInfo.userID" placeholder="Input username"/>
    <br><br>
    Password: <el-input type="text" v-model="loginInfo.password" placeholder="Input pwd"/>
    <br><br>
    <el-button type="default" v-on:click="login">Login</el-button>
    <br><br>
    </el-card>
  </div>
</template>

<script>
import {useRouter} from "vue-router";
import router from "@/router";
import {useStore} from "vuex";

export default {
  setup() {
    const store = useStore()  // 该方法用于返回store 实例
    console.log("store:::::")
    console.log(store)  // store 实例对象
    const router = useRouter();
    return {store};
  },
  name: "LoginPage",
  data() {
    return {
      loginInfo: {
        userID: '',
        password: '',
        registrationID: '',
      },
      responseResult: {
        uid:'',
        registrationId:'',
        identityKeyPair:'',
        preKeys:'',
        signedPreKey:''
      },
    }
  },
  methods: {
    login() {
      this.$http.post('/login', {
        username: this.loginInfo.userID,
        password: this.loginInfo.password,
      }).then(async successResponse => {
        if (successResponse.data.code === 200) {
          await this.store.dispatch('registration', this.loginInfo.userID);
          await router.replace("/cview");
        } else {
          alert("wrong")
        }
      })
    },
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
