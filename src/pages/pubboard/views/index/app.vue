<template>
  <div class="friend-ranking">
    <div class="leader-board" v-if="defaultIndex == 1">
      <div class="header"></div>
      <div class="ranking-content">
        <div class="ranking">
          <ul class="ranking-list">
            <li
              v-for="(item, index) in rankList"
              :key="index"
              :id="handleId(index)"
              class="ranking-li"
              :class="handleId(index)"
              v-show="index < 3">
              <div class="ranking-list-img" v-if="item.id">
                <img :src="item.headImgUrl || 'https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452573175835136.png'">
              </div>
              <p v-if="item.nickName || item.id">{{item.nickName || '用户' + (item.id || '') }}</p>
              <span class="lighting" v-if="item.count">{{ item.count || 1}}</span>
            </li>
          </ul>
        </div>
        <div class="last-ranking">
          <div
            v-for="(item, index) in rankList"
            :key="index"
            v-if="index > 2"
            class="last-list">
            <div class="author">
              <span>{{ index + 1 }}</span>
              <img :src="item.headImgUrl || 'https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452573175835136.png'">
              <p>{{ item.nickName || '用户' + (item.id || '')  }}</p>
            </div>
            <div class="lighting">{{ item.count || 1}}</div>
          </div>
          <infinite-loading @infinite="getRankList" ref="getRankList">
            <span slot="no-results" style="padding-bottom:50px;"></span>
            <span slot="no-more"></span>
            <!-- 没有更多了～ -->
          </infinite-loading>
        </div>
      </div>
    </div>
    <div class="friends-circle" v-if="defaultIndex == 2">
      <div class="header">
        <div class="boost-user" v-if="userInfo">
          <div class="author">
            <img :src="userInfo.headImgUrl || 'https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452573175835136.png'" alt="">
          </div>
          <div class="user">
            <h3>{{ userInfo.nickName || '用户 1' }}</h3>
            <p>你当前获得助力<span class="lighting">{{ userInfo.finish || 0 }}</span></p>
          </div>
          <div class="progress">
            <div class="progress-start"></div>
            <div
              class="progress-current"
              :style="handleWidth(userInfo.finish, userInfo.total)"></div>
            <div class="progress-end" :class="userInfo.finish >= userInfo.total ? 'progress-actived':''"></div>
            <p>{{ userInfo.total }}</p>
          </div>
        </div>
      </div>
      <div class="boost-list">
        <div
          v-for="(item, index) in followList"
          :key="index"
          class="list-member">
          <div class="member-image">
            <img :src="item.headImgUrl || 'https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452573175835136.png'" alt="">
            <span>{{ item.nickName || '用户' + item.id }}</span>
          </div>
          <div class="member-status">
            <span>{{ handleStatus(item.status) }}</span>
            <span>{{ item.followTime }}</span>
          </div>
        </div>
        <infinite-loading @infinite="getList" ref="infiniteLoading">
          <span slot="no-results" style="padding:10px 0;"></span>
          <!-- 没有更多了～ -->
          <!-- 没有更多了～ -->
          <span slot="no-more" style="padding:10px 0;"></span>
        </infinite-loading>
      </div>
    </div>
    <div class="footer">
      <div :class="defaultIndex == 1 ? 'actived':''" @click="checkActived(1)">
        <i class="iconfont icon-huabanfuben"></i>
        <span>排行榜</span>
      </div>
      <div :class="defaultIndex == 2 ? 'actived':''" @click="checkActived(2)">
        <i class="iconfont icon-huabanfuben"></i>
        <span>好友圈</span>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../services/apilist';
import InfiniteLoading from "vue-infinite-loading"; //引入加载更多组件
import getQueryUrl from '@/utils/getHashParameters.js'

export default {
  name: "leaderboard",
  data: () => ({
    defaultIndex: 1,
    followList: [],            // 助力成功榜
    mpActId: '',
    userInfo: [],             //个人信息
    rankList: [],             // 排行榜列表
    followFlag: false,
    rankFlag: false, 
    followPage: {
      pageNo: 1,
      pageSize: 10,
      count: 0,
      pageNum: 1,
    },
    rankPage: {
      pageNo: 1,
      pageSize: 10,
      count: 0,
      pageNum: 1,
    },
  }),
  components: {
    InfiniteLoading,
  },
  watch: {
    defaultIndex(index) {
      
      this.followList = [];

      if (index == 1) {
        // this.activityQueryRankList({ mpActId: this.mpActId, ...this.rankPage });
      } else if (index == 2) {  
        // this.activityQueryUserFollowList({ mpActId: this.mpActId, ...this.followPage }, '', true);
        this.activityQueryUserTarget({ mpActId: this.mpActId });
      }
    },
  },
  created() {
    let _this = this;
    // 获取 url 参数
    try {
      this.mpActId = getQueryUrl('mpActId');
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {},
  methods: {
    /**
     * 成功名单
     */
    getList($state) {
      this.activityQueryUserFollowList({ mpActId: this.mpActId, ...this.followPage }, $state);
    },
    /**
     * 排名
     */
    getRankList($state) {
      this.activityQueryRankList({ mpActId: this.mpActId, ...this.rankPage }, $state);
    },
    /**
     * 切换状态
     */
    checkActived(origin) {
      let index = 2;

      if (origin == 1) {
        index = 1;
      }

      this.defaultIndex = index;
    },
    /**
     * 处理 助力进度条
     */
    handleWidth(current, total) {
      let width = 0;
      
      current = Number(current)
      total = Number(total)
      
      width = (current / total) * 100;
      
      if (width >= 100) {
        width = 100;
      } else if (width <= 0) {
        width = 0;
      }

      return { width: width + '%' };
    },
    /**
     * 处理 id
     */
    handleId(index) {
      let NewIdString = '';
      if (index == 0) {
        NewIdString = 'ranking2';
      } else if (index == 1) {
        NewIdString = 'ranking1';
      } else if (index == 2) {
        NewIdString = 'ranking3';
      }
      return NewIdString;
    },
    /**
     * 获取榜单
     */
    activityQueryRankList(params, $state) {
      let obj = { id: '', openId: '', nickName: '', headImgUrl: '', count:0 };

      try {
        // let { data, code, msg, pager: { pageNum, pageSize, count } } = await this.$api.activityQueryRankList(params);
        this.$http.post(
          { api: Api.activityQueryRankList, type: 'formdata'},
          params,
          function success(res) {
            let newData = [];
            let { data, code, msg, pager: { pageNum, pageSize, count } } = res;
            console.log(res);
            if (code == 200) {
              if ($state) {
                if (data.length) {
                  
                  newData.push(...data);
                  let obj = {};

                  newData = newData.reduce((cur,next) => {
                    obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                    return cur;
                  },[])
                  
                  if (newData.length == 1) {
                    newData.push(obj)
                  }

                  if (newData.length == 2) {
                    console.log(data, 260);
                    newData.push(obj)
                  }

                  this.rankList = this.swapArr(newData, 0, 1);
                  pageNum ++;
                  $state.loaded();
                } else {
                  $state.complete();  
                }
              }

              this.rankPage = {
                pageNo: pageNum,
                pageNum,
                pageSize,
                count,
              }
            } else {
              this.$refs.getRankList.$emit('$InfiniteLoading:complete')
            }
          },
          function fail(error) {
            console.log(error);
          });
        
        

       
      } catch (error) {
        this.$refs.getRankList.$emit('$InfiniteLoading:complete')
        console.log(error);
      }
    },
    /**
     * 获取用户助力信息
     */
    activityQueryUserFollowList(params, $state) {
      
      
      try {
        // let { data, code, msg, pager: { pageNum, pageSize, count } } = await this.$api.activityQueryUserFollowList(params);

        this.$http.post(
          {
            api: Api.activityQueryUserFollowList,
            type: 'formdata'
          },
          params,
          function success(res) {
            let { data, code, msg, pager: { pageNum, pageSize, count } } = res;

            if (code == 200) {
              if ($state) {
                if (data.length) {
                  this.followList = this.followList.concat(data);
                  pageNum ++;
                  $state.loaded();
                } else {
                  $state.complete();
                }
              } else {
                $state.complete();
              }

              this.followPage = {
                pageNo: pageNum,
                pageNum,
                pageSize,
                count,
              }
            } else {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            }
          },
          function fail(error) {
            console.log(error);
          }
        )
      } catch (error) {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
        console.log(error);
      }
    },
    /**
     * 获取用户完成信息
     */
    activityQueryUserTarget(params) {
      try {
        // let { data, code, msg } = await this.$api.activityQueryUserTarget(params);
        this.$http.post(
          {
            api: Api.activityQueryUserTarget, 
            type: 'formdata'
          },
          params,
          function success(res) {
            let { data, code, msg } = res;

            if (code == 200) {
              this.userInfo = data;
            }
          },
          function fail(error) {
            console.log(error);
          },
        )
        
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 处理元素位置
     */
    swapArr(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    /**
     * 处理状态
     */
    handleStatus(status) {
      let newText = '';

      if (status == 1) {
        newText = '助力成功';
      } else if (status == 2) {
        newText = '老粉丝助力';
      } else if (status == 3) {
        newText = '取关';
      }

      return newText;
    },
  }
};
</script>

<style scoped lang='scss'>
.friend-ranking {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  font-size: 14px;
  .lighting {
    font-size: 24px;
    color: #fdca58;
    letter-spacing: 0;
    line-height: 50px;
    padding-right: 20px;
    background-image: url(https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452569726855680.png);
    background-repeat: no-repeat;
    background-position: right center;
    background-size: 20px;
  }
}
.leader-board {
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  .header {
    width: 100%;
    height: 202px;
    border-radius: 0 0 5% 5%;
    position: absolute;
    top: 0;
    z-index: 0;
    background-image: linear-gradient(90deg, #00c2ff 0%, #008aff 100%);
  }
  .ranking-content {
    margin: 0 15px;
    padding-top: 50px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .last-ranking {
    background: #fff;
    padding: 20px;
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
  }
  .ranking-list {
    height: 100px;
    display: flex;
    justify-content: space-between;
    padding: 30px 10px 20px;
  }
  .ranking {
    width: 100%;
    height: 180px;
    margin-top: 22px;
    background-color: #ffffff;
    background-size: cover;
    background-position: center;
    position: relative;
    border-radius: 10px 10px 0 0;
    li {
      width: 30%;
      height: 100px;
      margin: 0 5px;
      text-align: center;
      .ranking-list-img {
        // width: 50px;
        // height: 50px;
        text-align: center;
        // margin: 0 auto;
        position: relative;
        img {
          width: 100%;
          border-radius: 100%;
        }
      }
    }
    .ranking-li {
      height: 130px;
      .ranking-list-img:after {
        position: absolute;
        top: -20px;
        left: 50%;
        margin-left: -12px;
        content: "";
        background-size: 100%;
        width: 24px;
        height: 24px;
      }
    }

    .ranking2,
    .ranking-list .ranking3 {
      padding-top: 15px;
      .ranking-list-img img {
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 50%;
        border: solid 2px #fff;
        box-shadow: 0 5px 15px 0 rgba(84, 155, 213, 0.3);
      }
    }

    .ranking1 {
      padding: 40px 10px 0 10px;
      position: relative;
      top: -50px;
      background-color: #ffffff;
      border-radius: 10px;
      .ranking-list-img {
        &>img {
          width: 60px;
          height: 60px;
          overflow: hidden;
          border-radius: 50%;
          border: 2px solid #fcdd3f;
        }
        &:after {
          background-image: url(https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452572617787904.png);
        }
      }
    }
    .ranking2 {
      .ranking-list-img:after {
        background-image: url(https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452572799363584.png);
      }
    }
    .ranking3 {
      .ranking-list-img:after {
        background-image: url(https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452573002885632.png);
      }
    }
  }
  .last-list {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    
    .author {
      display: flex;
      justify-content: flex-start;
      & > span {
        font-size: 16px;
        color: #0c0c0c;
        letter-spacing: 0;
        line-height: 50px;
        width: 20px;
        margin-right: 18px;
      }
      & > img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
      }
      & > p {
        font-size: 14px;
        color: #232735;
        letter-spacing: 0;
        line-height: 50px;
        overflow: hidden;
      }
    }
  }
}
.friends-circle {
  flex: 1;
  overflow: hidden;
  // overflow-y: auto;
  background-color: #ececec;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    height: 202px;
    border-radius: 0 0 5% 5%;
    background-image: linear-gradient(90deg, #00c2ff 0%, #008aff 100%);
  }
  .boost-user {
    width: 90%;
    height: 200px;
    background-color: #ffffff;
    border-radius: 5px;
    margin: 0 auto;
    position: relative;
    top: 70px;
    z-index: 1;
    .user {
      text-align: center;
      margin-top: -20px;
      h3 {
        font-size: 20px;
        font-weight: 700;
      }
      p {
        font-weight: 700;
        span {
          margin-left: 10px;
        }
      }
    }
    .progress {
      width: 75%;
      height: 50px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      position: relative;
      .progress-actived {
        color: #fff;
        background-color: #fcdd3f;
      }
      &-start {
        width: 100%;
        height: 10px;
        background-color: #efefef;
        border-radius: 5px;
        position: absolute;
        left: -10px;
      }
      &-end {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: #efefef;
        position: absolute;
        right: -10px;
      }
      &-current {
        position: absolute;
        left: -10px;
        height: 10px;
        border-radius: 5px;
        background-color: #fcdd3f;
      }
      p {
        width: 25px;
        text-align: center;
        position: absolute;
        top: 40px;
        right: -10px;
      }
    }
    .author {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      border:1px solid #fcdd3f;
      overflow: hidden;
      position: relative;
      top: -35px;
      left: 50%;
      margin-left: -35px;
      z-index: 1;
      img {
        width: 100%;
      }
    }
  }
  .boost-list {
    flex: 1;
    width: 100%;
    margin-top: 80px;
    padding-bottom: 10px;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;
    .list-member {
      width: 90%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
      .member-image {
        display: flex;
        align-items: center;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          padding: 5px;
          box-sizing: border-box;
        }
        span {
          font-weight: 700;
        }
      }
      .member-status {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        span {
          padding: 5px 0;
        }
        span:first-child {
          font-weight: 700;
        }
      }
    }
  }
}
.footer {
  height: 50px;
  display: flex;
  align-items: center;
  text-align: center;
  border-top: 1px solid #ccc;
  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
.actived {
  color: #0c8eff;
}
</style>

<style>
#wrapper {
  /* position: absolute;
  top: 1px;
  bottom: 1px;
  left: 0; */
  width: 100%
}

#scroller li {
  height: 60px;
  line-height: 60px;
  background: #ecf6ff;
  margin-top: 10px
}

#pullDown,
#pullUp {
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  color: #888;
  text-align: center
}
</style>
