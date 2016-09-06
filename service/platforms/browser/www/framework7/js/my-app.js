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

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        
    });
});