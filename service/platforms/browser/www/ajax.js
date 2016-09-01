var xhrTimeout=100;

function myAjax(){

var soapMessage ='<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="urn:mathwsdl"> <SOAP-ENV:Body><tns:RectangleArea xmlns:tns="urn:mathwsdl"><L xsi:type="xsd:int">5</L><l xsi:type="xsd:int">2</l></tns:RectangleArea></SOAP-ENV:Body></SOAP-ENV:Envelope>';

var url='http://localhost/animego/server.php';
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
   httpRequest.onreadystatechange=callbackAjax;

   httpRequest.setRequestHeader("Man","POST http://localhost/animego/server.php HTTP/1.1")       

   httpRequest.setRequestHeader("MessageType", "CALL");

   httpRequest.setRequestHeader("Content-Type", "text/xml");

   httpRequest.send(soapMessage);
}

   function callbackAjax(){
      try {
         if(httpRequest.readyState==4) {
            if(httpRequest.status==200) {
              clearTimeout(xhrTimeout);                                                             
              resultDiv=document.getElementById("resultDiv");            
              resultDiv.style.display='inline';                                          
              var x =httpRequest.responseText;
              alert("fdsfds");
            }
         } 
      } catch(e) { 
           alert("Error!"+e); 
      }      
   }