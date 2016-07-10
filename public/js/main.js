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

  $('.btn#findMatches').click(function(){
    var artist1 = $('#searchfld1').attr('value');
    var artist2 = $('#searchfld2').attr('value');
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
