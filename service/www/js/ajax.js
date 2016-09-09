var xhrTimeout=1000;
var url='http://descartes.esy.es/';
var urn = 'urn:descartes';
var ajax_control = false;

select_pontos();

if(localStorage.getItem("login_id") == null)
  mainView.router.loadPage('login.html');

function mostrar_storage()
{
  var login_id = localStorage.getItem("login_id");
  myApp.alert("Usuário: "+login_id,'Informações de Login');
}

function submit_login()
{
  $$("#login_form").click();
}

function login()
{
  var email = document.getElementById("login_email").value;
  var senha = document.getElementById("login_senha").value;
  var id = null;

  id = ajax_method(false,'usuario.login',email,senha);

  if (id != 0)
  {
    myApp.alert('Login realizado com sucesso!');
    localStorage.setItem("login_id",id);
  }
  else
    myApp.alert('Email ou senha não correspondem!');
}

function logout()
{
  localStorage.removeItem("login_id");  
  myApp.alert('Logout efetuado com sucesso.');
}

function select_pontos()
{
  var json_dados = null;
  var i = 0;

  myApp.showPreloader();

  setTimeout(function () {
    json_dados = ajax_method(false,'ponto.select','');

    var ponto = JSON.parse(json_dados);

    for(i=0;i<ponto.length;i++)
    {
      json_dados = ajax_method(false,'endereco.select_by_id',ponto[i].endereco_id);
      console.log(json_dados);
      var endereco = JSON.parse(json_dados);
      var features = [];
      features["type"] = "mark1";
      features["position"] = new google.maps.LatLng(endereco[0].latitude,endereco[0].longitude);
      features["info"] = '<div id="content">'+
                            '<div id="siteNotice"></div>'+
                              '<h1 id="firstHeading" class="firstHeading">ponto</h1>'+
                              '<div id="bodyContent" class="col-sm-12">'+
                                '<p class="col-sm-6"></p>'+
                                '<p class="col-sm-6"></p>'+
                            '</div>'+
                          '</div>';
      features["draggable"] = false;
      addMarker(features);
    }
    var markerCluster = new MarkerClusterer(map, markers, options); 
    myApp.hidePreloader();
  },100);
 
}

function ajax_method()
{

  myApp.showPreloader();
  var method = arguments[1];
  var sync = arguments[0];

  var retorno = null;

  var soapMessage ='<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="'+urn+'"> <SOAP-ENV:Body><tns:'+method+' xmlns:tns="'+urn+'">';
  for (var i = 2; i < arguments.length; i++)
  {
    console.log(arguments[i]);
    soapMessage += '<input'+i+' xsi:type="xsd:string">'+arguments[i]+'</input'+i+'>';
  }
  
  soapMessage += '</tns:'+method+'></SOAP-ENV:Body></SOAP-ENV:Envelope>';

  if(window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) { 
    httpRequest = new ActiveXObject("Microsoft.XMLHTTP"); 
  }
  httpRequest.open("POST",url,sync);
  if (httpRequest.overrideMimeType) { 
    httpRequest.overrideMimeType("text/xml"); 
  }

  httpRequest.onreadystatechange = function (){
    if((httpRequest.readyState == 4) && (httpRequest.status==200))
    {
      clearTimeout(xhrTimeout);

      var parser = new DOMParser();
      var responseDoc = parser.parseFromString(httpRequest.responseText, "text/html");
      var json_dados = responseDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
      retorno = json_dados;
    }
  };

  httpRequest.setRequestHeader("Man","POST "+url+" HTTP/1.1")       

  httpRequest.setRequestHeader("MessageType", "CALL");

  httpRequest.setRequestHeader("Content-Type", "text/xml");

  httpRequest.send(soapMessage);

  myApp.hidePreloader();

  return retorno;
}