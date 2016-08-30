var xhrTimeout=100;
var url='http://localhost/animego/server.php';

function myAjax(method)
{
var largura = document.getElementById("largura").value;
var altura = document.getElementById("altura").value;

var soapMessage ='<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="urn:mathwsdl"> <SOAP-ENV:Body><tns:'+method+' xmlns:tns="urn:mathwsdl"><p xsi:type="xsd:int">'+altura+'</p><l xsi:type="xsd:int">'+largura+'</l></tns:'+method+'></SOAP-ENV:Body></SOAP-ENV:Envelope>';

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
   httpRequest.onreadystatechange = call_back;

   httpRequest.setRequestHeader("Man","POST "+url+" HTTP/1.1")       

   httpRequest.setRequestHeader("MessageType", "CALL");

   httpRequest.setRequestHeader("Content-Type", "text/xml");

   httpRequest.send(soapMessage);
}

function call_back()
{
    try
    {
      if(httpRequest.readyState==4)
      {
        if(httpRequest.status==200)
        {
          clearTimeout(xhrTimeout);                                                             
          resultDiv=document.getElementById("resultDiv");            
          resultDiv.style.display='inline';                                          
          resultDiv.innerHTML='Resultado='+httpRequest.responseText;
        }
      } 
    } 
    catch(e) 
    { 
      alert("Error!"+e); 
    }      
}