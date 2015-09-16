(function($) {
  
  var iTunesApp_tpl = '' +
  '<div>' +
  '  <div class="iTunesApp-head">' +
  '    <span class="iTunesApp-icon"></span>' +
  '    <span class="iTunesApp-name"></span>' +
  '    von <span class="iTunesApp-artist"></span>' +
  '    <span class="iTunesApp-price"></span>' +
  '  </div>' +
  '  <div class="iTunesApp-preview"></div>' +
  '</div>';

  function iTunesApp_init() {
    $('[data-itunesid]').each(function(i, elm) {
      var $this = $(this);
      var id = $this.attr('data-itunesid');
      iTunesApp_getItunesData(id, function(data) {
        var $that = $this;
        iTunesApp_UpdateLayout($that, data);
      });
    });
  }
  
  iTunesApp_init();
  window.iTunesApp_init = iTunesApp_init;

  function iTunesApp_getItunesData(appID, callback) {
    console.log('iTunesApp_getItunesData', appID);
    $.getJSON('https://itunes.apple.com/de/lookup?callback=?&id='+appID, function( data ) {
      if(data.resultCount == 0) { return false; }
      console.log('iTunesApp_getItunesDataResult', data.results[0]);
      callback(data.results[0]);
    });
  }

  function iTunesApp_UpdateLayout($that, app){
    if(!app) { return false; }
   
    $that.empty().addClass('iTunesApp');
    
    var $entry = $(iTunesApp_tpl).appendTo($that);
    
    $entry.find('.iTunesApp-name').text(app.trackName);

    var $itunesLink = $('<a class="link itunes"/>').attr('href', app.trackViewUrl).attr('target', '_blank');
    
    if(typeof iTunesApp_AffiliateID != "undefined" && iTunesApp_AffiliateID != "") {
      $itunesLink.attr('href', $itunesLink.attr('href') + '&at=' + iTunesApp_AffiliateID);
    }
    
    $entry.find('.iTunesApp-name').wrapInner($itunesLink);
    $entry.find('.iTunesApp-icon').wrap($itunesLink);
    
    $entry.find('.iTunesApp-artist').text(app.artistName);
    
    if(app.sellerUrl) {
      var $webLink = $('<a class="link web"/>').attr('href', app.sellerUrl).attr('target', '_blank');
      $entry.find('.iTunesApp-artist').wrapInner($webLink);
    }
    
    var $icon = $('<img />').attr('src', app.artworkUrl100);
    $entry.find('.iTunesApp-icon').append($icon);

    $entry.find('.iTunesApp-price').text(app.formattedPrice);
    
    $.each(app.screenshotUrls, function(i, screenshotUrl){
      screenshotUrl = screenshotUrl.replace('320x320', '640x640');
      var $previewImage = $('<img/>').attr('src', screenshotUrl);
      $entry.find('.iTunesApp-preview').append($previewImage);
      $previewImage.wrap($('<a target="_blank"/>').attr('href', screenshotUrl));
    });
  }

})(jQuery);
