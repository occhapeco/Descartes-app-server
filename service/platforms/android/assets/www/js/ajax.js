var xhrTimeout=1000;
var url='http://descartes.esy.es/';
var urn = 'urn:descartes';
var ajax_control = false;

inicializar();

function inicializar()
{
  if(localStorage.getItem("login_id") == null)
  {
    myApp.swipePanel = false;
    mainView.router.loadPage('login.html');
  }
  else
  {
    myApp.swipePanel = 'left';
    mainView.router.loadPage('mapa.html');
  }
  //localStorage.removeItem("tutorial");
}

function tutorial()
{
  /*if(localStorage.getItem("tutorial") != 3)
  {
    if(localStorage.getItem("tutorial") == null)
      localStorage.setItem("tutorial",0);

    var popoverHTML = "";
    var component = null;
    
    if(localStorage.getItem("tutorial") == 0)
    {
      component = document.getElementById("map");
      popoverHTML = '<div class="popover" onclose="tutorial();" style="margin-top:50px;z-index:1333331 !important;">'+
                      '<div class="popover-angle"></div>'+
                      '<div class="popover-inner">'+
                        '<div class="content-block">'+
                          '<p style="font-size:18px;">Bem-vindo ao Descartes Lab! Aqui você pode encontrar pontos de coleta de lixo próximos de você.</p>'+
                          '<p style="font-size:12px;">Toque em qualquer lugar para continuar.</p>'+
                        '</div>'+
                      '</div>'+
                    '</div>';
    }
    else if(localStorage.getItem("tutorial") == 1)
    {
      $$('#searche').click();
      component = document.getElementById("searche");
      popoverHTML = '<div class="popover" onclose="tutorial();" style="margin-top:50px;z-index:1333331 !important;">'+
                      '<div class="popover-angle"></div>'+
                      '<div class="popover-inner">'+
                        '<div class="content-block">'+
                          '<p style="font-size:18px;">Pesquise qualquer localização aqui.</p>'+
                          '<p style="font-size:12px;">Toque em qualquer lugar para continuar.</p>'+
                        '</div>'+
                      '</div>'+
                    '</div>';
    }
    else if(localStorage.getItem("tutorial") == 2)
    {
      $$('#searche').click();
      component = document.getElementById("popover-btn");
      popoverHTML = '<div class="popover" onclose="tutorial();" style="z-index:1333331 !important;">'+
                      '<div class="popover-angle"></div>'+
                      '<div class="popover-inner">'+
                        '<div class="content-block">'+
                          '<p style="font-size:18px;">Selecione aqui os tipos de lixo que você precisa descartar.</p>'+
                          '<p style="font-size:12px;">Toque em qualquer lugar para continuar.</p>'+
                        '</div>'+
                      '</div>'+
                    '</div>';
    }

    localStorage.setItem("tutorial",localStorage.getItem("tutorial") + 1);
    myApp.popover(popoverHTML,component);
  }*/
}

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
    myApp.swipePanel = 'left';
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
  
  var json_dados = ajax_method(false,'ponto.select','');

  var ponto = JSON.parse(json_dados);

  for(var i=0;i<ponto.length;i++)
  {
    json_dados = ajax_method(false,'endereco.select_by_id',ponto[i].endereco_id);
    var endereco = JSON.parse(json_dados);
    var features = [];
    features["type"] = "mark1";
    features["position"] = new google.maps.LatLng(endereco[0].latitude,endereco[0].longitude);
    features["info"] = '<div id="content">'+
                          '<div id="siteNotice"></div>'+
                            '<h1 id="firstHeading" class="firstHeading">ponto</h1>'+
                            '<button class="button" onclick ="calculateAndDisplayRoute('+endereco[0].latitude+','+
                            endereco[0].longitude+')"'+
                            '<div id="bodyContent" class="col-sm-12">'+
                              '<p class="col-sm-6"></p>'+
                              '<p class="col-sm-6"></p>'+
                          '</div>'+
                        '</div>';
    features["draggable"] = false;
    addMarker(features);
  }
  var markerCluster = new MarkerClusterer(map, markers, options); 
}

function criar_popover()
{
  var component = document.getElementById("popover-list");
  var html = '<ul>'+
                '<li>'+
                    '<div class="item-content"> '+
                      '<div class="item-inner">'+
                        '<div class="item-title" style="font-size:18px;">Filtros</div>'+
                      '</div>'
                    '</div>'+
                  '</li>';

  var json_dados = ajax_method(false,'tipo_lixo.select','');
  var tipo_lixo = JSON.parse(json_dados);

  for(var i=0;i<tipo_lixo.length;i++)
    html += '<li>'+
              '<label class="label-checkbox item-content">'+
                '<input type="checkbox" name="'+tipo_lixo[i].id+'">'+
                '<div class="item-media">'+
                  '<i class="icon icon-form-checkbox"></i>'+
                '</div>'+
                '<div class="item-inner">'+
                  '<div class="item-title">'+tipo_lixo[i].nome+'</div>'+
                '</div>'+
              '</label>'+
            '</li>';
  html += "</ul>";
  component.innerHTML = html;
}

function ajax_method()
{
  var method = arguments[1];
  var sync = arguments[0];

  var retorno = null;

  var soapMessage ='<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="'+urn+'"> <SOAP-ENV:Body><tns:'+method+' xmlns:tns="'+urn+'">';
  for (var i = 2; i < arguments.length; i++)
    soapMessage += '<input'+i+' xsi:type="xsd:string">'+arguments[i]+'</input'+i+'>';
  
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

  return retorno;
}