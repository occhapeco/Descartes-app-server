// Initialize your app
var myApp = new Framework7({
    material: true,
    pushState: true,
    swipePanel: 'left',
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
        createContentPage();
    });
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('login-screen', function (page) {
    // run createContentPage func after link was clicked
    $$('#sign').on('click', function () {
        login_ajax();
    });
});


// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}

user = localStorage.getItem("user");
if (user == null)
    mainView.loadPage("login.html");

var xhrTimeout=100;
var url='http://localhost/descartes/service/server.php';
var urn='urn:descartes';
var user = null;

function login_ajax()
{
    var method = 'empresa.login';
    var email = document.getElementById("login_email").value;
    var senha = document.getElementById("login_senha").value;

    var soapMessage ='<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="'+urn+'"> <SOAP-ENV:Body><tns:'+method+' xmlns:tns="'+urn+'"><p xsi:type="xsd:string">'+email+'</p><l xsi:type="xsd:string">'+senha+'</l></tns:'+method+'></SOAP-ENV:Body></SOAP-ENV:Envelope>';

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
          alert(httpRequest.responseText);
        }
      } 
    } 
    catch(e) 
    { 
      alert("Error!"+e); 
    }      
}