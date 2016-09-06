var xhrTimeout=1000;
var url='http://descartes.esy.es/';
var urn = 'urn:descartes';

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

function logout()
{
  localStorage.removeItem("login_id");
  localStorage.removeItem("login_type");
  myApp.alert('Logout efetuado com sucesso.');
}

function login_ajax()
{
  var method = 'usuario.login';

  var email = document.getElementById("login_email").value;
  var senha = document.getElementById("login_senha").value;

  var soapMessage ='<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="'+urn+'"> <SOAP-ENV:Body><tns:'+method+' xmlns:tns="'+urn+'">'+
  '<email xsi:type="xsd:string">'+email+'</email>'+
  '<senha xsi:type="xsd:string">'+senha+'</senha>'+
  '</tns:'+method+'></SOAP-ENV:Body></SOAP-ENV:Envelope>';

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
  httpRequest.onreadystatechange = function (){
    if((httpRequest.readyState == 4) && (httpRequest.status==200))
      {
        clearTimeout(xhrTimeout);
        myApp.hidePreloader();

        var parser = new DOMParser ();
        var responseDoc = parser.parseFromString (httpRequest.responseText, "text/html");
        var id = responseDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
        if (id != 0)
        {
          myApp.alert('Login realizado com sucesso!');
          localStorage.setItem("login_id",id);
        }
        else
          myApp.alert('Email ou senha não correspondem!');
      }
  };

  httpRequest.setRequestHeader("Man","POST "+url+" HTTP/1.1")       

  httpRequest.setRequestHeader("MessageType", "CALL");

  httpRequest.setRequestHeader("Content-Type", "text/xml");

  httpRequest.send(soapMessage);

  myApp.showPreloader();

}

function select_pontos_ajax()
{
  var method = 'pontos.select';

  var soapMessage ='<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="'+urn+'"> <SOAP-ENV:Body><tns:'+method+' xmlns:tns="'+urn+'">'+
  '<condicoes xsi:type="xsd:string"></condicoes>'+
  '</tns:'+method+'></SOAP-ENV:Body></SOAP-ENV:Envelope>';

  if(window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) { 
    httpRequest = new ActiveXObject("Microsoft.XMLHTTP"); 
  }
  httpRequest.open("POST",url,true);
  if (httpRequest.overrideMimeType) { 
    httpRequest.overrideMimeType("text/xml"); 
  }
  httpRequest.onreadystatechange = function () {
    if((httpRequest.readyState == 4) && (httpRequest.status==200))
    {
      
      clearTimeout(xhrTimeout);
      myApp.hidePreloader();

      var parser = new DOMParser();
      var responseDoc = parser.parseFromString(httpRequest.responseText, "text/html");
      var json_dados = responseDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
      var ponto = JSON.parse(json_dados);
      myApp.alert(ponto);
    }
  };

  httpRequest.setRequestHeader("Man","POST "+url+" HTTP/1.1")       

  httpRequest.setRequestHeader("MessageType", "CALL");

  httpRequest.setRequestHeader("Content-Type", "text/xml");

  httpRequest.send(soapMessage);

  myApp.showPreloader("Carregando pontos...");

}
