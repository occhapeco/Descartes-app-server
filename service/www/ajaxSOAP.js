var xhrTimeout=100;
var url='http://localhost/descartes/service/server.php';
var urn = 'urn:descartes';

function login()
{
  empresa_login_ajax();
}

function empresa_login_ajax()
{
  var method = 'empresa.login';

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
  httpRequest.onreadystatechange = call_empresa_login;

  httpRequest.setRequestHeader("Man","POST "+url+" HTTP/1.1")       

  httpRequest.setRequestHeader("MessageType", "CALL");

  httpRequest.setRequestHeader("Content-Type", "text/xml");

  httpRequest.send(soapMessage);
}

function call_empresa_login()
{
    try
    {
      if(httpRequest.readyState==4)
      {
        if(httpRequest.status==200)
        {
          clearTimeout(xhrTimeout);

          var parser      = new DOMParser ();
          var responseDoc = parser.parseFromString (httpRequest.responseText, "text/html");
          var id = responseDoc.getElementsByTagName("return");
          var retorno = id[0].childNodes[0].nodeValue;
          if (retorno != 0)
            alert("Login de empresa realizado com êxito! Seu id: "+retorno);
          else
            usuario_login_ajax();
        }
      } 
    } 
    catch(e) 
    { 
      alert("Error!"+e); 
    }      
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
  httpRequest.onreadystatechange = call_usuario_login;

  httpRequest.setRequestHeader("Man","POST "+url+" HTTP/1.1")       

  httpRequest.setRequestHeader("MessageType", "CALL");

  httpRequest.setRequestHeader("Content-Type", "text/xml");

  httpRequest.send(soapMessage);
}

function call_usuario_login()
{
    try
    {
      if(httpRequest.readyState==4)
      {
        if(httpRequest.status==200)
        {
          clearTimeout(xhrTimeout);

          var parser      = new DOMParser ();
          var responseDoc = parser.parseFromString (httpRequest.responseText, "text/html");
          var id = responseDoc.getElementsByTagName("return");
          var retorno = id[0].childNodes[0].nodeValue;
          if (retorno != 0)
            alert("Login de usuario realizado com êxito! Seu id: "+retorno);
          else
            alert("Email ou senha não correspondem!");
        }
      } 
    } 
    catch(e) 
    { 
      alert("Error!"+e); 
    }      
}