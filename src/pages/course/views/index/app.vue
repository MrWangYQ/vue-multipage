<template>
	<div id="box" class="app" v-if="showAll">
		<div class="box">
			<div class="header">
				<h5>{{detail.title}}</h5>
				<p>{{detail.beginTime | formatDate}}</p>
			</div>
			<div class="portrait">
				<img :src="detail.teacherPic" alt="">
				<p>{{detail.teacherName}}</p>
			</div>
		</div>
		<div class="content">
			<p><span>课程介绍</span></p>
			<div class="content-img">
        <ul>
          <li v-for="item in detail.introduceImage" :key="item">
            <img :src="item" alt="">
          </li>
        </ul>
      </div>
		</div>
		<div class="footer" @click="showBtns">立即报名</div>
		<div id="hidebg" v-if="showbtn"></div>
		<div class="showQR" v-if="showbtn">
	        <div class="showQRTitle">
	            <div class="showQRTitleL">报名成功</div>
	            <div class="showQRTitleR" @click="hidebg">x</div>
	        </div>
	        <div class="imgs" v-if="detail.isfirstScope === 2">
	        	 <!-- <img src="../../../static/image/success.png" alt=""> -->
	        </div>
	        <!-- <div class="showQRTitle" v-if="detail.isfirstScope === 1">
	            <div class="showQRTitleL">请关注公众号</div>
	            <div class="showQRTitleR" @click="hidebg">x</div>
	        </div> -->
	        <p v-if="detail.isfirstScope === 1" class="des">长按下方二维码，关注公众号</p>
	        <p v-if="detail.isfirstScope === 1" class="des">接收上课提醒</p>
	        <div class="img" v-if="detail.isfirstScope === 1">
	            <img :src="detail.pubAddress" alt="">
	        </div>
	    </div>
	</div>
	
</template>
<script>
	import Api from '@/api/apijson';
  import Ip from '@/utils/gtag.js';
  import getQueryUrl from '@/utils/getHashParameters';
	import {formatDate} from '@/utils/formatDate.js'

	export default {
		data: () => ({
			showbtn: true,
			code:"",
			appId:'', 
			courseNumber:'',
			detail:{},
			showAll: true
		}),
		created(){
			this.appId = getQueryUrl('appId');
      this.courseNumber = getQueryUrl('courseNumber');
      this.getCourseDetail(this.courseNumber)
		},
		methods:{
			getCourseDetail(val){
        let _this = this;

        this.$http.post(
          { api: Ip.gtagIp + Api.queryAppPushCourseDetail, type: 'json' },
          { courseNumber:val },
          function success(data) {
            console.log(data);
            this.detail = data.data
						let nowTime = Date.parse(new Date())
						let begTime = data.data.beginTime
						if(nowTime>begTime){
							window.location.href = data.data.liveAddress
						} else {
							_this.showAll = true
						}
          },
          function fail(error) {
            console.log(error, 74);
          }
        )
        .then((res)=>{
					if(res.data.code === 200){
						this.detail = res.data.data
						let nowTime = Date.parse(new Date())
						let begTime = res.data.data.beginTime
						if(nowTime>begTime){
							window.location.href = res.data.data.liveAddress
						} else {
							this.showAll = true
						}
					}else{
						//  this.RouterGO('/error');
					}
				}).catch((error)=>{
				})
			},
			showBtns(){
				this.showbtn = true;
			},
			hidebg(){
				this.showbtn = false;
			},
			// 路由跳转
      RouterGO(toPath) {
        let origin = window.location.origin;
      
        if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
          window.location.href = origin + '/#' + toPath;
        } else {
          this.$router.push({ path: toPath })
        }
      },
		},
		filters:{
			formatDate(time) {
          time = time
          let date = new Date(time)
          return formatDate(date, 'yyyy年MM月dd日 hh时mm分')
		    }
		}
	}
</script>
<style lang='scss' scoped>
	.app{
		box-sizing: border-box;
    background-color: #fff;
    font-size: 14px;
    width: 100%;
    background: rgb(242,242,242);
    height: 100%;
		.box{
			width: 100%;
  			height: 160px;
  			background: #fff;
  			.header{
	  			width: 100%;
	  			height: 80px;
	  			padding: 0 10px;
				box-sizing: border-box;
	  			h5{
	  				width: 100%;
	  				height: 40px;
	  				line-height: 42px;
	  				font-weight: 600;
	  				font-size: 16px;
	  			}
	  			p{
	  				width: 100%;
	  				height: 40px;
	  				// padding: 0 10px;
	  				line-height: 42px;
	  				border-bottom: 1px solid #ccc;
	  				// box-sizing: border-box;
	  			}

	  		}
	  		.portrait{
	  			width: 100%;
	  			height: 80px;
	  			display: flex;
	  			align-items: center;
	  			// flex-direction: column;
	  			// justify-content: center;
	  			padding: 0 10px;
				box-sizing: border-box;
				img{
					width: 40px;
					height: 40px;
					border-radius: 50%;
				}
				p{
					flex: 1;
					padding-left: 10px;
				}
	  		}
		}
		.content{
			margin-top: 14px;
			background: #fff;
			p{
				width: 100%;
				height: 50px;
				padding-top: 10px;
				box-sizing: border-box;
				span{
					width: 80px;
					height: 30px;
					display: block;
					background: #ccc;
					line-height: 32px;
					text-align: center;
				}
			}
		}
	}
	ul,
    li, {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    li:last-child{
    	margin-bottom: 50px;
    }
    li>img{
    	width: 100%;
    	height: 100%;
    	vertical-align:bottom;
    }
    .footer{
    	position:fixed;
        height:50px;
        width:100%;
        bottom:0;
        background: rgb(242, 242, 242);;
        display: flex;
        padding: 0 20px;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }
    .showQR{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        width: 260px;
        height: 260px;
        z-index:999;
        border-radius: 10px;
    }
    .showQRTitle{
        width: 100%;
        height: 40px;
        /*background: red;*/
        display: flex;

    }
    .showQRTitleL{
        flex: 1;
        line-height: 40px;
        text-align: center;
        color: #777;
        padding-left: 40px;
    }
    .showQRTitleR{
        width: 40px;
        height: 100%;
        line-height: 40px;
        text-align: center;
    }
    .des{
        height: 20px;
        width: 100%;
        line-height: 20px;
        
        color: #888;
        text-align: center;
    }
    .img,.imgs{
        height: 140px;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .img img{
        height: 140px;
        width: 140px;
    }
    .imgs{
    	margin-top: 40px;
    }
    .imgs img{
    	width: 80px;
    	height: 80px;
    }
     #hidebg{
        width:100%;
        height:100%;
        position:fixed;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        background-color:#999;
        opacity:0.80;
        z-index:5;
    }
</style>