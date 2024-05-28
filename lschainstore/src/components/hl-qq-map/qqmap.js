import { jsonp } from "vue-jsonp";
var url = "https://apis.map.qq.com";
const md5 = require('md5');
export function TMap(key) {
  return new Promise(function(resolve, reject) {
    window.init = function() {
      resolve(qq); 
    };
    var script = document.createElement("script");
    script.type = "text/javascript";

    script.src =
      "https://map.qq.com/api/js?v=2.exp&libraries=place&callback=init&key=" +
      key;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
export function getMapAddress(key, lat, lng) {
  return new Promise(function(resolve, reject) {
    let callback = 'hl'
    var locationData = lat + "," + lng; //纬度，经度
    
    var api = "/ws/geocoder/v1?callback="+callback+"&get_poi=0&key="+key+"&location="+locationData+'&output=jsonp&poi_options=address_format=short';

    var sig = md5(api +'DiDJB3Hkv1MpTx76yCFQmPc4A500aGfV');

    jsonp(url + api + '&sig='+ sig,{
      callbackName: callback,
      output: "jsonp"
    }) 
      .then(json => {
        
        resolve(eval(json));
      })
      .catch(err => {
        console.log('err',err);
        reject(err);
      });
  });
}
