var xhrTimeout=1000;
var url='http://descartes.esy.es/';
var urn = 'urn:descartes';

inicializar();

$$(document).on('pageInit', function (e) {
    var page = e.detail.page;

    if(page.name === 'index')
    {
      inicializar();
    }

    if(page.name === 'login')
    {
      if(localStorage.getItem("login_id") != null)
        mainView.router.loadPage('mapa.html');
    }

    if(page.name === 'mapa')
    {
      inicializar_map();
      mapa_refresh();
    }

    if(page.name === 'perfil')
    {
      carregar_perfil();
    }
});

function mapa_refresh()
{
  myApp.showPreloader();
  setTimeout(function () {
    inicializar_map();  
    criar_popover();
    select_pontos();
    myApp.hidePreloader();
  },500);
}

function inicializar()
{
  if(localStorage.getItem("login_id") == null)
  {
    mainView.router.loadPage('login.html');
  }
  else
  {
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

function carregar_perfil()
{
  myApp.showPreloader();
  setTimeout(function () {
    var json_dados = ajax_method(false,'usuario.select',"id = "+localStorage.getItem("login_id"));
    var usuario = JSON.parse(json_dados);
    document.getElementById("usuario_nome").value = usuario[0].nome;
    document.getElementById("usuario_email").value = usuario[0].email;
    document.getElementById("usuario_telefone").value = usuario[0].telefone;
    myApp.hidePreloader();
  },100);
}

function alterar_perfil()
{
  myApp.showPreloader();
  setTimeout(function () {
    var json_dados = ajax_method(false,'usuario.update_perfil',localStorage.getItem("login_id"),document.getElementById("usuario_nome").value,document.getElementById("usuario_email").value,document.getElementById("usuario_telefone").value);
    console.log(json_dados);
    var retorno = JSON.parse(json_dados);
    if(retorno)
      myApp.alert("Perfil alterado com sucesso.");
    else
      myApp.alert("Erro ao alterar perfil.");
  myApp.hidePreloader();
  },100);

  mainView.router.loadPage('perfil.html');
}

function alterar_senha()
{
  if (document.getElementById("usuario_senha1").value != "" && document.getElementById("usuario_senha2").value != "") {
    if(document.getElementById("usuario_senha1").value == document.getElementById("usuario_senha2").value)
    {
      var json_dados = ajax_method(false,'usuario.update_senha',localStorage.getItem("login_id"),document.getElementById("usuario_senha_antiga").value,document.getElementById("usuario_senha1").value);
      var retorno = JSON.parse(json_dados);
      if(retorno)
      {
        myApp.alert("Senha alterada com sucesso.");
        mainView.router.loadPage('perfil.html');
      }
      else
        myApp.alert("Erro ao alterar senha.");
    }
    else
      myApp.alert("Senhas não coincidem.");
  }
  else
  {
    myApp.alert("Um ou mais campos foram deixados em branco.");
  }
}

function login()
{
  var email = document.getElementById("login_email").value;
  var senha = document.getElementById("login_senha").value;
  var id = null;

  myApp.showPreloader();
  setTimeout(function () {
    id = ajax_method(false,'usuario.login',email,senha);

    if (id != 0)
    {
      localStorage.setItem("login_id",id);
      myApp.alert('Login realizado com sucesso!',function (){
        mainView.router.loadPage('mapa.html');
      });
    }
    else
    {
      myApp.alert('Email ou senha não correspondem!');
    }
    myApp.hidePreloader();
  },100);
}

function logout()
{
  localStorage.removeItem("login_id");  
  mainView.router.loadPage('login.html');
}

function select_pontos()
{
  var json_dados = ajax_method(false,'ponto.select','');

  var ponto = JSON.parse(json_dados);

  setMapOnAll(null);
  markers = [];

  for(var i=0;i<ponto.length;i++)
  {
    json_dados = ajax_method(false,'endereco.select_by_id',ponto[i].endereco_id);
    var endereco = JSON.parse(json_dados);
    var features = [];
    features["type"] = "mark1";
    features["position"] = new google.maps.LatLng(endereco[0].latitude,endereco[0].longitude);
    features["info"] = '<div class="list-block cards-list">'+
                         '<ul>'+
                           '<li class="card">'+
                             '<div class="card-header">Nome do ponto</div>'+
                             '<div class="card-content">'+
                               '<div class="card-content-inner">Descrição do ponto</div>'+
                             '</div>'+
                             '<div class="card-footer">'+
                             '<div class="content-block"><div class="buttons-row">'+
                               '<a href="#" style="width:auto" class="button button-raised button-fill color-green">Agende sua coleta</a>'+
                             ''+
                               '<a href="#" style="width:auto" class="button button-raised button-fill color-blue" onclick ="calculateAndDisplayRoute'+
                               '('+endereco[0].latitude+','+endereco[0].longitude+')">Rotas até aqui</a>'+
                             '</div></div></div>'+
                           '</li>'+
                         '</ul>'+
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


var o = true;

var swidth = $$("#ba").width() - $$("#searche").width() - $$("#bc").width() - 16;
swidth+='px';
$$("#hc").css('width',swidth);

function search(){
    alert("hjk");
    if (o) 
    {
        $$("#refresh").hide();
        $$("#hc").css('width',swidth );
        $$("#hc").toggleClass('hi');
        $$("#hd").toggleClass('hi');
        $$("#loc").toggleClass('fa-search, fa-remove');
        $$("#pac-input").focus();
        o = false;
    }else
    {
        $$("#refresh").show();
        $$("#hc").css('width',swidth);
        $$("#hd").toggleClass('hi');
        $$("#hc").toggleClass('hi');
        $$("#loc").toggleClass('fa-search, fa-remove');
        o = true;
    }
}