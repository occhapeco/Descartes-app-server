// Initialize your app
var myApp = new Framework7({
    material: true,
    pushState: true,
    animatePages: true,
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        show_login();
    });
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('login-screen', function (page) {
    // run createContentPage func after link was clicked
    $$('#sign').on('click', function () {
      myAjax();
    });
});

user = localStorage.getItem("user");
if (user == null)
{
  mainView.loadPage("login.html");
}

var xhrTimeout=100;
var url='http://localhost/descartes/service/server.php';
var urn='urn:mathwsdl';
var user = null;

function login_ajax()
{
    var method = 'math.RectangleArea';
    var email = document.getElementById("login_email").value;
    var senha = document.getElementById("login_senha").value;

    var soapMessage ='<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="'+urn+'"> <SOAP-ENV:Body><tns:'+method+' xmlns:tns="'+urn+'"><email xsi:type="xsd:string">'+email+'</email><senha xsi:type="xsd:string">'+senha+'</senha></tns:'+method+'></SOAP-ENV:Body></SOAP-ENV:Envelope>';
    if(window.XMLHttpRequest) {
        httpRequest=new XMLHttpRequest();
    }
    else if (window.ActiveXObject) { 
        httpRequest=new ActiveXObject("Microsoft.XMLHTTP"); 
    }
    httpRequest.open("POST",url,true);
    if (httpRequest.overrideMimeType) { 
       httpRequest.overrideMimeType("text/xml"); 
    }
    httpRequest.onreadystatechange = call_login();

    httpRequest.setRequestHeader("Man","POST "+url+" HTTP/1.1")       

    httpRequest.setRequestHeader("MessageType", "CALL");

    httpRequest.setRequestHeader("Content-Type", "text/xml");

    httpRequest.send(soapMessage);
}

function call_login(){
    try
    {
      if(httpRequest.readyState==4)
      {
        if(httpRequest.status==200)
        {
          clearTimeout(xhrTimeout);                                                             
          alert("fdsfdsfds");
        }
      } 
    } 
    catch(e) 
    { 
      alert("Error!"+e); 
    }

    $$('.panel').show;      
}

