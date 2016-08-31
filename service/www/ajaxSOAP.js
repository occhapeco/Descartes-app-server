var xhrTimeout=100;
var url='http://localhost/animego/server.php';

var user = NULL;
if (localStorage.getItem("user") == NULL)
{
  // Redirecionar para página de login
}
else
{
  user = JSON.parse(localStorage.getItem("user"));
}

function login_ajax()
{
var email = document.getElementById("email").value;
var senha = document.getElementById("senha").value;

var soapMessage ='<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="urn:mathwsdl"> <SOAP-ENV:Body><tns:empresa.login xmlns:tns="urn:mathwsdl"><p xsi:type="xsd:string">'+email+'</p><l xsi:type="xsd:string">'+senha+'</l></tns:empresa.login></SOAP-ENV:Body></SOAP-ENV:Envelope>';

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
   httpRequest.onreadystatechange = function {
     if(httpRequest.readyState==4)
      {
        clearTimeout(xhrTimeout);                                                             
        var resposta = eval(httpRequest.responseText);
        if (resposta == NULL)
        {
          //  Deu bosta
        }
        else
        {
          // Ajeitar ainda
          localStorage.setItem("user",JSON.stringify(user));
        }
      }
      return httpRequest.readyState;  
   }

   httpRequest.setRequestHeader("Man","POST "+url+" HTTP/1.1")       

   httpRequest.setRequestHeader("MessageType", "CALL");

   httpRequest.setRequestHeader("Content-Type", "text/xml");

   httpRequest.send(soapMessage);
}
