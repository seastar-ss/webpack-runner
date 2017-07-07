var _=require("./base.js");
var conf={
    //输入模板的基礎位置
    parentFolder:"",
    //第一次模板输出html文件的基础位置
    baseFolder:"views/html",
    //输出的资源文件基础路径
    baseResourceFolder:"dist/resources/",
    //页面内引用基础文件使用的服务器前缀
    baseHost:"",
    //页面内引用基础文件使用的路径前缀
    basePath:"./",
    baseHtmlOutputFolder:"dist/html",
    assetReferPath:"../asset"
};
_.prepare(conf);

var tmpl =  "views/templates/layouts/defaultLayout.html";
var base = {
    _httpHeader:  "views/templates/layouts/defaultHttpHeader.html",
    title: "测试项目",
    _header:  "views/templates/layouts/defaultHeader.html",
    _menu:  "views/templates/layouts/defaultMenu.html",
    _topNav:  "views/templates/layouts/defaultTopNav.html",
    _footer: "views/templates/layouts/defaultFooter.html",
    _jsBottom:  "views/templates/layouts/defaultScript.html",
    commonEntry:[
        "views/asset/static/css/bootstrap.css", "views/asset/static/font-awesome/css/font-awesome.css", "views/asset/static/LESS/style.less",
        "views/asset/static/js/plugins/metisMenu/jquery.metisMenu.js"
    ],
    asset:conf.assetReferPath
};

var templates = {

    //安全设置
    "revisePwd": _.commonSetting(base,"views/pages/revisePwd/revisePwd.html","修改密码"),
    //忘记密码
    "forgetPwd": _.commonSetting(base,"views/pages/forgetPwd/forgetPwd.html","忘记密码"),
    //404页面
    "notFound404": _.commonSetting(base,"views/pages/notFound404/notFound404.html","404"),
    //策略管理
    "investPage": _.commonSetting(base,"views/pages/investPage/investPage.html","首页",function(def){
        def._investDialog="views/pages/public/html/invest_dialog.html";
    }),
   
};

var tmplLogin =   "views/templates/layouts/defaultLayoutLogin.html";
var templateLogin = {
    //登录
    "login": _.commonSetting({
        _httpHeader:  "views/templates/layouts/defaultHttpHeader.html",
        _jsBottom:  "views/templates/layouts/defaultScript.html",
    },"views/pages/login/login.html","登录"),
};

//_.buildAll(tmplLogin, templateLogin, baseFolder);
_.buildAll(tmplLogin,templateLogin);

_.buildAll(tmpl, templates);

for(var x in templateLogin){
    templates[x]=templateLogin[x];
}

module.exports={
    templates:templates,
    conf:conf
};