let getQueryUrl;

try {
    // 取 URL 参数
    let getHashParameters = function () {
        let hash = location.hash || '';
        let hashParams = hash.split('?');

        if (hashParams.length < 2) return;
        
        let arr = hashParams[1].split('&')
        let params = {}
        
        for (let i = 0; i < arr.length; i++) {
            let data = arr[i].split('=')
            if (data.length === 2) {
            params[data[0]] = data[1]
            }
        }
        return params 
    }
    
    getQueryUrl = function (key) {
        var params = getHashParameters();
        
        if (!params) return '';
        
        return params[key] || '';
    }
} catch (error) {
    console.log(error);   
}


export default getQueryUrl;
