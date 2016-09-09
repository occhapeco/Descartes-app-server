// Initialize your app
var myApp = new Framework7({
    material: true,
    pushState: true,
    animatePages: true,
    swipePanel: "left",
    swipePanelActiveArea: 20,
    modalTitle: "Descartes Lab",
    modalButtonCancel: "Cancelar",
    modalPreloaderTitle: "Carregando...",
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var o = true;

var swidth = $$("#ba").width() - $$("#searche").width() - $$("#bc").width() - 16;
swidth+='px';
$$("#hc").css('width',swidth);

$$('#searche').on('click', function (e){
    if (o) 
    {
        $$("#hc").css('width',swidth );
        $$("#hc").toggleClass('hi');
        $$("#hd").toggleClass('hi');
        $$("#loc").toggleClass('fa-search, fa-remove');
        $$("#pac-input").focus();
        o = false;
    }else
    {
        $$("#hc").css('width',swidth);
        $$("#hd").toggleClass('hi');
        $$("#hc").toggleClass('hi');
        $$("#loc").toggleClass('fa-search, fa-remove');
        o = true;
    }
    
});

