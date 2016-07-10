/*fun jQuery stuff in here*/
$(document).ready(function(){
  $('.artist-list').hide();

  $('.searchfld').on('keypress', function(){
  //  event.stopPropagation();
    $(this).closest('.col-xs-6').find('.artist-list').slideToggle();
  })

  $('.heading').addClass('animated bounceIn');
  // $('button').addClass('animated pulse')
  // $('.shittyLogo').addClass('animated bounceIn');
  // $('.shittyLogo').animate({opacity: 0}, 1000);
  // $('.shittyLogo:hidden:first').animate({opacity: 1}, 1000);

   

    // $.getJSON("http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=9a09b3b6f2f046ad39b28327bf5477e6&format=json", function(data) {
    //     var html = '';
    //     $.each(data, function(i, item) {
    //         // html += "<p>" + item.name + " - " + item.playcount + "</p>";
    //         console.log(item)
    //     });
    //   //  $('#test').append(html);
    //      // topArt = data.topartists;
    // });

  $('.btn#findMatches').click(function(){
    var artist1 = $('#searchfld1').attr('value');
    console.log(artist1)
    var artist2 = $('#searchfld2').attr('value');
    console.log(artist2)
    window.location.href = '/search?artist1='+encodeURIComponent(artist1)+"&artist2="+encodeURIComponent(artist2);
  })

  $(function() {
      var pull = $('#pull');
          menu = $('#navigation-bar-mobile ul');
          // menuHeight  = menu.height();
      $(pull).on('click', function(e) {
          e.preventDefault();
          $('.header').toggleClass('show-nav');
          // menu.slideToggle();
      });
  });
});
