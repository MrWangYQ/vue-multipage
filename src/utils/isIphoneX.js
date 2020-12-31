function isIphoneX(){
  if(/iphone/gi.test(window.navigator.userAgent)){
      /* iPhone X、iPhone XS */
      var x=(window.screen.width === 375 && window.screen.height === 812);
      /* iPhone XS Max */
      var xsMax=(window.screen.width === 414 && window.screen.height === 896);
      /* iPhone XR */
      var xR=(window.screen.width === 414 && window.screen.height === 896);
      if(x || xsMax || xR){
          return true;
      }else{
          return false;
      }
  }else{
      return false
  }
}
export default isIphoneX;