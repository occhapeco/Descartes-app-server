                //criação da infowindow
        var infowindow = new google.maps.InfoWindow();
        var poder = true; // somente utilizada quando a empresa for criar um ponto para selecionar o local
        var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 2,
                center: new google.maps.LatLng(0.234035, -24.178513),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [
                  {
                    "stylers": [
                      { "visibility": "on" },
                      { "weight": 1 },
                      { "hue": "#64B5F6" },
                      { "gamma": 0.75 }
                    ]
                  },
                  {
                    featureType: 'landscape',
                    elementType: 'geometry',
                    stylers: [
                      { hue: '#00ff00' }
                    ]
                  },
                  {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [
                      { hue: '#00ff00' }
                    ]
                  }
                ]
        });

        //responsivo
        google.maps.event.addDomListener(window, "resize", function() {
           var center = map.getCenter();
           google.maps.event.trigger(map, "resize");
           map.setCenter(center);
        });

        //cria o input para pesquisar no mapa
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Encontra o lugar pesquisado
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            //coloca o lugar em uma variável para dar fit no mapa
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });

        //local dos ícones utilizados
        var icons = {
                mark1: {
                  icon: 'mapa/images/mark1.png'
                },
                mark2: {
                  icon: 'mapa/images/mark2.png'
                }
        };

        //função que adiciona marcadores
        function addMarker(feature) {
          var marker = new google.maps.Marker({
            position: feature.position,
            icon: icons[feature.type].icon,
            map: map,
            draggable:feature.draggable, // se pode ser arrastado
            info: feature.info //conteudo do marcador
          });

          google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(this.info); //conteúdo do marcador
            infowindow.open(map, this);
          });

          if (feature.draggable == true) {

            document.getElementById('lat').value = marker.position.lat();
            document.getElementById('long').value = marker.position.lng();

            google.maps.event.addListener(marker,'dragend', function() {
                document.getElementById('lat').value = marker.position.lat();
                document.getElementById('long').value = marker.position.lng();
            });
          }

          markers.push(marker);
        }

        //cluster de marcadores
        var options = {
                  imagePath: 'mapa/images/m'
        };

         // cria cluster

//-------AJAX-------//


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