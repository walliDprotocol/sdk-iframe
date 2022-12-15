(function(){var t={202:function(t,e,n){"use strict";var a=n(7195),s=function(){var t=this,e=t._self._c;return e("v-app",{staticClass:"verification-iframe"},[e("v-app-bar",{staticClass:"iframe-app-bar",attrs:{app:"",elevation:"0",color:"transparent",height:"74"}},[e("v-container",[e("v-row",[e("v-col",[e("v-img",{staticClass:"shrink mr-2",attrs:{alt:"Vuetify Logo",contain:"",src:n(7458),transition:"scale-transition",width:"115"}})],1),e("v-spacer"),t.nearAccount?e("v-col",[e("p",{staticClass:"bold-text-p"},[t._v("AccountId")]),t._v(" "+t._s(t.nearAccount)+" ")]):t._e()],1)],1)],1),e("v-main",[e("router-view",{staticClass:"px-7"})],1)],1)},o=[],c=n(408),r={name:"App",computed:{...(0,c.rn)(["nearAccount"])}},i=r,l=n(1001),u=(0,l.Z)(i,s,o,!1,null,null,null),d=u.exports,p=n(2241),f=function(){var t=this,e=t._self._c;return e("v-container",[1==t.step?e("v-row",[e("v-col",{attrs:{cols:"12"}},[e("h1",{staticClass:"title-h1"},[t._v("Select the IDs you'd like to verify")])]),e("v-col",{staticClass:"pt-5",attrs:{cols:"12"}},[e("IdCardWrapper",{attrs:{items:t.accountIds},on:{"update:selected":function(e){t.selectedAccount=e}}})],1),e("v-col",{staticClass:"d-flex justify-end"},[e("FormButton",{attrs:{text:"Next",disabled:!t.selectedAccount.IdNameDesc},on:{click:function(e){t.step=2}}})],1)],1):t._e(),2==t.step?e("v-row",[e("v-col",{attrs:{cols:"12"}},[e("h1",{staticClass:"title-h1"},[t._v(" Connect to your "+t._s(t.selectedAccount.IdNameDesc)+" account and select the levels you want to verify ")])]),e("v-col",{staticClass:"pt-5",attrs:{cols:"12"}},[e("ConnectAccount",{attrs:{selectedAccount:t.selectedAccount}})],1),e("v-col",{staticClass:"d-flex justify-end"},[e("FormButton",{staticClass:"mr-5",attrs:{text:"Back",type:"back"},on:{click:function(e){t.step=1}}}),e("FormButton",{attrs:{text:t.nearAccount?"VERIFY":"CONNECT"},on:{click:t.connectAccount}})],1)],1):t._e()],1)},m=[],h=function(){var t=this,e=t._self._c;return e("v-btn",t._b({staticClass:"form-button",class:t.type,on:{click:function(e){return t.$emit("click")}}},"v-btn",t.$attrs,!1),[e("div",[t._v(" "+t._s(t.text)+" ")])])},v=[],g={name:"FormButton",props:["text","type"],mounted(){},components:{}},w=g,_=(0,l.Z)(w,h,v,!1,null,null,null),b=_.exports,x=function(){var t=this,e=t._self._c;return e("v-container",{staticClass:"pa-0"},[e("v-row",{staticClass:"text-center"},t._l(t.items,(function(n,a){return e("v-col",{key:a,attrs:{cols:"12",sm:"4"},on:{click:function(e){t.selected=a}}},[e("IdCard",{class:{selected:a==t.selected},attrs:{item:n}})],1)})),1)],1)},C=[],y=function(){var t=this,e=t._self._c;return e("v-container",{staticClass:"id-card-container fill-height"},[e("v-row",{staticClass:"text-left id-card-row"},[e("v-col",{staticClass:"id-card-col pr-0",attrs:{cols:"3"}},[e("v-img",{attrs:{src:`./logos/${t.item.IdName}.webp`,contain:"","max-height":"40","max-width":"40"}})],1),e("v-col",{staticClass:"id-card-col pl-0 d-flex flex-column align-start",attrs:{cols:"9"}},[e("p",{staticClass:"bold-text-p text-uppercase",class:{"mb-2":!t.userData.username}},[t._v(" "+t._s(t.item.IdNameDesc)+" "),t.userData.username?e("v-icon",{attrs:{color:"green",right:"",size:16}},[t._v(" mdi-checkbox-marked-circle ")]):t._e()],1),t.userData.username?t._e():e("p",{staticClass:"normal-text-p"},[t._v(" "+t._s(t.idDescription[t.item.type](t.item))+" ")]),t.userData.username?e("p",{staticClass:"mb-0"},[t._v("@"+t._s(t.userData.username))]):t._e(),t.userData.username?e("p",{staticClass:"bold-text-p mb-0"},[t._v(" "+t._s(t.userData.name)+" ")]):t._e()])],1)],1)},A=[],k={name:"HelloWorld",props:["item"],computed:{userData(){return this.item?.userData||{}}},data(){return{idDescription:{web2:({IdNameDesc:t})=>`Connect your ${t} account`,web3:({IdDescription:t})=>`${t}`}}}},I=k,D=(0,l.Z)(I,y,A,!1,null,"8dd76304",null),S=D.exports,N={name:"HelloWorld",components:{IdCard:S},props:["items"],watch:{selected(){this.$emit("update:selected",this.items[this.selected])}},data(){return{selected:-1}}},O=N,j=(0,l.Z)(O,x,C,!1,null,null,null),F=j.exports,P=function(){var t=this,e=t._self._c;return e("v-container",{staticClass:"connect-account pa-3"},[e("v-row",{staticClass:"text-center"},[e("v-col",{staticClass:"d-flex",attrs:{cols:"12"}},[e("v-col",{staticClass:"d-flex align-center",attrs:{cols:"auto"}},[e("v-img",{attrs:{src:`./logos/${t.selectedAccount.IdName}.webp`,contain:"","max-height":"40","max-width":"40"}})],1),e("v-col",{staticClass:"pl-0 d-flex flex-column align-start justify-center",attrs:{cols:"8"}},[e("p",{staticClass:"bold-text-p text-uppercase mb-0"},[t._v(" "+t._s(t.selectedAccount.IdNameDesc)+" ")]),e("p",{staticClass:"mb-0"},[t._v(" "+t._s(t.userData.username)+" ")]),e("p",{staticClass:"bold-text-p mb-0"},[t._v(" "+t._s(t.userData.name)+" ")])]),e("v-spacer"),e("v-col",{staticClass:"d-flex flex-column align-center justify-center",attrs:{cols:"2"}},[e("p",{staticClass:"bold-text-p text-uppercase mb-0",on:{click:t.setAll}},[t._v(" Select all ")])])],1)],1),t._l(t.selectedAccount.options,(function(n,a){return e("v-row",{key:a,staticClass:"text-center"},[e("v-col",{staticClass:"d-flex align-start",attrs:{cols:"12"}},[e("v-col",{staticClass:"d-flex fill-height align-start",attrs:{cols:"2"}},[e("p",{staticClass:"bold-text-p text-left mb-0"},[t._v(" "+t._s(n.field)+" ")])]),e("v-col",{staticClass:"pl-0 d-flex fill-height flex-column align-start justify-space-between",attrs:{cols:"5"}},t._l(n.description,(function(n,a){return e("p",{key:a,staticClass:"normal-text-p text-left"},[t._v(" "+t._s(n)+" ")])})),0),e("v-spacer"),e("v-col",{staticClass:"d-flex fill-height flex-column align-center justify-center py-4",attrs:{cols:"2"}},[e("v-switch",{staticClass:"mt-0 form-switch",attrs:{"hide-details":"",ripple:!1},model:{value:n.state,callback:function(e){t.$set(n,"state",e)},expression:"item.state"}})],1)],1)],1)}))],2)},Z=[],$={name:"HelloWorld",props:["selectedAccount"],computed:{userData(){return this.selectedAccount?.userData||{}}},methods:{setAll(){this.selectedAccount?.options.map((t=>t.state=!0))}},data(){return{selected:-1}}},T=$,B=(0,l.Z)(T,P,Z,!1,null,"713891ee",null),U=B.exports,E=n(7218),V=n(19),L={name:"HomeView",data(){return{accountIds:[],step:1,selectedAccount:{},userData:{}}},computed:{...(0,c.rn)(["nearAccount"])},methods:{async connectAccount(){console.log("Call connectAccount"),this.nearAccount?await this.$store.dispatch("twitterConnect"):(localStorage.setItem("selectedAccount",this.selectedAccount.IdName),await this.wallet.requestSignIn("example-contract.testnet","Verification iframe","http://127.0.0.1:8080/","http://127.0.0.1:8080"))}},async mounted(){const t=new E.keyStores.BrowserLocalStorageKeyStore,e={networkId:"testnet",keyStore:t,nodeUrl:"https://rpc.testnet.near.org",walletUrl:"https://wallet.testnet.near.org",helperUrl:"https://helper.testnet.near.org",explorerUrl:"https://explorer.testnet.near.org"};this.near=await E.connect(e),this.wallet=new E.WalletConnection(this.near),console.log(this.wallet),this.accountIds=(await V.Z.get("userData.json")).data.accountIds;let n=new URLSearchParams(window.location.search);console.log(n),n.has("account_id")&&(localStorage.setItem("nearAccount",n.get("account_id")),localStorage.getItem("selectedAccount")&&(this.selectedAccount=this.accountIds.find((t=>t.IdName==localStorage.getItem("selectedAccount"))),this.step=2)),this.$store.commit("nearAccount",localStorage.getItem("nearAccount"));let a=JSON.parse(localStorage.getItem("twitter_preAuth"));console.log("pre Auth tokens ",a);let s=JSON.parse(localStorage.getItem("twitter_user"));if(s)this.userData=s;else if(n.has("state")&&n.has("code")&&a){let t=n.get("state"),e=n.get("code");console.log("oauth_state: ",t),console.log("oauth_code: ",e),console.log("twitter_preAuth : ",a),this.userData=await this.$store.dispatch("getTwitterUsername",{state:t,code:e,codeVerifier:a.codeVerifier})}if(this.userData.username){this.selectedAccount=this.accountIds.find((t=>"twitter"==t.IdName));let t=this.accountIds.findIndex((t=>"twitter"==t.IdName));this.accountIds[t].userData=this.userData,await this.$forceUpdate()}},components:{IdCardWrapper:F,FormButton:b,ConnectAccount:U}},W=L,H=(0,l.Z)(W,f,m,!1,null,null,null),J=H.exports;a["default"].use(p.ZP);const M=[{path:"/",name:"home",component:J},{path:"/about",name:"about",component:()=>n.e(443).then(n.bind(n,1168))}],R=new p.ZP({routes:M});var q=R;const z="https://sdk-connector-api.herokuapp.com/api/v1/redirect/login/twitter",G="https://sdk-connector-api.herokuapp.com/api/v1/redirect/twitter";console.log(z),a["default"].use(c.ZP);var K=new c.ZP.Store({state:{nearAccount:null},getters:{},mutations:{nearAccount(t,e){t.nearAccount=e}},actions:{async twitterConnect(){let t;try{let e=await V.Z.get(z);console.log("get from axios ",e.data),e?.data?.redirect&&(t=e.data,localStorage.setItem("twitter_preAuth",JSON.stringify(t)),console.log("twitterPreAuthURL: ",t),window.location.replace(t.redirect))}catch(e){throw console.log("error twitter login: ",e),e}return t},async getTwitterUsername(t,{state:e,code:n,codeVerifier:a}){console.log("***** Get twitter username *****  ");let s={};try{let t=await V.Z.post(G,{state:e,code:n,codeVerifier:a});console.log("response from twitter login: ",t.data),s={username:t.data.username,name:t.data.name,id:t.data.id},localStorage.setItem("twitter_user",JSON.stringify(s))}catch(o){throw console.log("error twitter login: ",o),o}return s}},modules:{}}),Y=n(6017),Q=n.n(Y);n(8556);a["default"].use(Q());var X=new(Q())({theme:{options:{customProperties:!0},themes:{light:{primary:"#00afc5",secondary:"#424242",accent:"#82B1FF",error:"#FF5252",info:"#2196F3",success:"#4CAF50",warning:"#FFC107"}}}});n(678);a["default"].config.productionTip=!1,new a["default"]({router:q,store:K,vuetify:X,render:t=>t(d)}).$mount("#app")},7458:function(t,e,n){"use strict";t.exports=n.p+"img/wallid.624500f0.webp"},6601:function(){},5024:function(){}},e={};function n(a){var s=e[a];if(void 0!==s)return s.exports;var o=e[a]={id:a,loaded:!1,exports:{}};return t[a].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}n.m=t,function(){n.amdO={}}(),function(){var t=[];n.O=function(e,a,s,o){if(!a){var c=1/0;for(u=0;u<t.length;u++){a=t[u][0],s=t[u][1],o=t[u][2];for(var r=!0,i=0;i<a.length;i++)(!1&o||c>=o)&&Object.keys(n.O).every((function(t){return n.O[t](a[i])}))?a.splice(i--,1):(r=!1,o<c&&(c=o));if(r){t.splice(u--,1);var l=s();void 0!==l&&(e=l)}}return e}o=o||0;for(var u=t.length;u>0&&t[u-1][2]>o;u--)t[u]=t[u-1];t[u]=[a,s,o]}}(),function(){n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,{a:e}),e}}(),function(){n.d=function(t,e){for(var a in e)n.o(e,a)&&!n.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:e[a]})}}(),function(){n.f={},n.e=function(t){return Promise.all(Object.keys(n.f).reduce((function(e,a){return n.f[a](t,e),e}),[]))}}(),function(){n.u=function(t){return"js/about.14bcbaf7.js"}}(),function(){n.miniCssF=function(t){}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){var t={},e="verification-sdk-iframe:";n.l=function(a,s,o,c){if(t[a])t[a].push(s);else{var r,i;if(void 0!==o)for(var l=document.getElementsByTagName("script"),u=0;u<l.length;u++){var d=l[u];if(d.getAttribute("src")==a||d.getAttribute("data-webpack")==e+o){r=d;break}}r||(i=!0,r=document.createElement("script"),r.charset="utf-8",r.timeout=120,n.nc&&r.setAttribute("nonce",n.nc),r.setAttribute("data-webpack",e+o),r.src=a),t[a]=[s];var p=function(e,n){r.onerror=r.onload=null,clearTimeout(f);var s=t[a];if(delete t[a],r.parentNode&&r.parentNode.removeChild(r),s&&s.forEach((function(t){return t(n)})),e)return e(n)},f=setTimeout(p.bind(null,void 0,{type:"timeout",target:r}),12e4);r.onerror=p.bind(null,r.onerror),r.onload=p.bind(null,r.onload),i&&document.head.appendChild(r)}}}(),function(){n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){n.nmd=function(t){return t.paths=[],t.children||(t.children=[]),t}}(),function(){n.p="/"}(),function(){var t={143:0};n.f.j=function(e,a){var s=n.o(t,e)?t[e]:void 0;if(0!==s)if(s)a.push(s[2]);else{var o=new Promise((function(n,a){s=t[e]=[n,a]}));a.push(s[2]=o);var c=n.p+n.u(e),r=new Error,i=function(a){if(n.o(t,e)&&(s=t[e],0!==s&&(t[e]=void 0),s)){var o=a&&("load"===a.type?"missing":a.type),c=a&&a.target&&a.target.src;r.message="Loading chunk "+e+" failed.\n("+o+": "+c+")",r.name="ChunkLoadError",r.type=o,r.request=c,s[1](r)}};n.l(c,i,"chunk-"+e,e)}},n.O.j=function(e){return 0===t[e]};var e=function(e,a){var s,o,c=a[0],r=a[1],i=a[2],l=0;if(c.some((function(e){return 0!==t[e]}))){for(s in r)n.o(r,s)&&(n.m[s]=r[s]);if(i)var u=i(n)}for(e&&e(a);l<c.length;l++)o=c[l],n.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return n.O(u)},a=self["webpackChunkverification_sdk_iframe"]=self["webpackChunkverification_sdk_iframe"]||[];a.forEach(e.bind(null,0)),a.push=e.bind(null,a.push.bind(a))}();var a=n.O(void 0,[998],(function(){return n(202)}));a=n.O(a)})();
//# sourceMappingURL=app.f9bcf2b2.js.map