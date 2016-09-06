var xhrTimeout=1000;
var url='http://descartes.esy.es/';
var urn = 'urn:descartes';

if ((localStorage.getItem("login_id") == 'null') || (localStorage.getItem("login_id") == null))
  mainView.router.loadPage('login.html');

function mostrar_storage()
{
  var login_id = localStorage.getItem("login_id");
  var login_type = localStorage.getItem("login_type");
  myApp.alert(login_type+": "+login_id,'Informações de Login');
}

function submit_login()
{
  $$("#login_form").click();
}

function logout()
{
  localStorage.setItem("login_id",null);
  localStorage.setItem("login_type",null);
  myApp.alert('','Logoff efetuado com sucesso.');
}

function empresa_login_ajax()
{
  var email = document.getElementById("login_email").value;
  var senha = document.getElementById("login_senha").value;
  var method = 'empresa.login';

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
    if(httpRequest.readyState==4)
    {
      if(httpRequest.status==200)
      {
        clearTimeout(xhrTimeout);

        var parser = new DOMParser ();
        var responseDoc = parser.parseFromString(httpRequest.responseText, "text/html");
        var id = responseDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
        if (id != 0)
        {
          myApp.hidePreloader();
          myApp.alert('Id de empresa: '+id,'Login realizado com sucesso!');
          localStorage.setItem("login_id",id);
          localStorage.setItem("login_type","empresa");
        }
        else
          usuario_login_ajax();
      }
    } 
  };

  httpRequest.setRequestHeader("Man","POST "+url+" HTTP/1.1")       

  httpRequest.setRequestHeader("MessageType", "CALL");

  httpRequest.setRequestHeader("Content-Type", "text/xml");

  httpRequest.send(soapMessage);

  myApp.showPreloader('Carregando...');
}

function usuario_login_ajax()
{
  var method = 'usuario.login';

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
  httpRequest.onreadystatechange = function (){
    if(httpRequest.readyState==4)
      {
        if(httpRequest.status==200)
        {
          clearTimeout(xhrTimeout);

          var parser      = new DOMParser ();
          var responseDoc = parser.parseFromString (httpRequest.responseText, "text/html");
          var id = responseDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
          if (id != 0)
          {
            myApp.hidePreloader();
            myApp.alert('Id de usuário: '+id,'Login realizado com sucesso!');
            localStorage.setItem("login_id",id);
            localStorage.setItem("login_type","usuario");
          }
          else
            myApp.hidePreloader();
            myApp.alert('','Email ou senha não correspondem!');
        }
      }
  };

  httpRequest.setRequestHeader("Man","POST "+url+" HTTP/1.1")       

  httpRequest.setRequestHeader("MessageType", "CALL");

  httpRequest.setRequestHeader("Content-Type", "text/xml");

  httpRequest.send(soapMessage);

}
