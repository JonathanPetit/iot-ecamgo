var products = [];

var app = {
   initialize: function() {
      this.bindEvents();
      console.log("Starting NFC Reader app");
   },

   bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
   },

   onDeviceReady: function() {
      nfc.addTagDiscoveredListener(
         app.onNfc,             
         function (status) { 
            //app.display("Tap a tag to read its id number.");
         },
         function (error) { 
            alert("NFC reader failed to initialize " +
            JSON.stringify(error));
         }
      );
   },
   
   onNfc: function(nfcEvent) {
      var tag = nfcEvent.tag;
      var payload = "+ " + nfc.bytesToHexString(tag.id);
      var product = mqttFunc.mqttConnect("Jonh", "ecam/go/cli/", payload);
      //app.display("Read tag: " + nfc.bytesToHexString(tag.id));
   },
}; 
    
var mqttConnection = false;
var mqttFunc = {
   mqttConnect: function(clientId, topic, payload) {
      cordova.plugins.CordovaMqTTPlugin.connect({
         url:"tcp://iot.eclipse.org", 
         port:1883,
         clientId:"Jonh",
         success:function(s){
            mqttConnection = true;
            console.log(JSON.stringify(s));
            var mqttTopicToSend = topic + clientId;
            var mqttTopicToListen = "ecam/go/rasp/" + clientId;
            mqttFunc.mqttSubscribe(mqttTopicToSend);
            mqttFunc.mqttPublish(mqttTopicToSend, payload);
            mqttFunc.mqttSubscribe(mqttTopicToListen);
            mqttFunc.mqttListen(mqttTopicToListen);
         },
         error:function(e){
            mqttConnection = false;
            //alert("err!! something is wrong with mqtt connexion.");
            console.log(e);
         },
         onConnectionLost:function (){
            mqttConnection = false;
            alert("err!! Mqtt connexion lost.");
         },
     })
   },

   mqttDisconnect: function() {
      cordova.plugins.CordovaMqTTPlugin.disconnect({
         success:function(s){
            mqttConnection = false;
            console.log(JSON.stringify(s));
         },
         error:function(e){
            console.log(e);
         }
       })
   },

   mqttSubscribe: function(topic) {
      if (!mqttConnection) {
         mqttFunc.mqttConnect();
      } else {
         cordova.plugins.CordovaMqTTPlugin.subscribe({
            topic:topic,
            qos:0,
            success:function(s){
               console.log(JSON.stringify(s));
            },
            error:function(e){
               alert("err!! Subscribe not possible.");
            }
         })
      }
   },

   mqttUnSubscribe: function(topic) {
      if (!mqttConnection) {

         mqttFunc.mqttConnect();
      }
      cordova.plugins.CordovaMqTTPlugin.unsubscribe({
         topic:topic,
         success:function(s){
            console.log(JSON.stringify(s));
         },
         error:function(e){
            alert("err!! UnsSubscribe not possible.");
         }
      })
   },

   mqttPublish: function(topic, payload) {
      if (!mqttConnection) {
         mqttFunc.mqttConnect();      
      }
      cordova.plugins.CordovaMqTTPlugin.publish({
         topic:topic,
         payload:payload,
         qos:0,
         retain:false,
         success:function(s){
            console.log(JSON.stringify(s));
         },
         error:function(e){
            alert("err!! Publish not possible.");
         }
      })
   },

   mqttListen: function(topic) {
      if (!mqttConnection) {
         mqttFunc.mqttConnect();
      }
      cordova.plugins.CordovaMqTTPlugin.listen(topic,function(payload,params){
         var product = utils.splitMsg(payload);
         display.display(product);
      })
   },
};

var first = true;
var products = {};
var listProduct = [];
var display = {
   display: function(msg) {
      products[msg.product] = msg.price;
      listProduct.push(msg.product)

      var label = document.createTextNode(msg.product + ": " + msg.price + "euros"),
      lineBreak = document.createElement("br");
      messageDiv.appendChild(lineBreak);   
      messageDiv.appendChild(label); 
      
      var price = utils.totalPrice(products, listProduct);
      var price = document.createTextNode(price + " euros");
      totalPrice.innerHTML = "";
      totalPrice.appendChild(price)
   },

   clear: function() {
      messageDiv.innerHTML = "";
   }

};

var utils = {
   splitMsg: function(payload) {
      var res = payload.split(" ");
      return {
         product: res[0],
         price: res[1]
      };
   },

   totalPrice: function(products, listProducts) {
      var total = 0;
      for(var key in listProducts){
         var value = products[listProducts[key]];
         total += Number(value);
      }
      return total;
   }
}

function end() {
   mqttFunc.mqttConnect("Jonh", "ecam/go/cli/", "end");
}
    
    