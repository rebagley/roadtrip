/*fun jQuery stuff in here*/
$(document).ready(function(){
  $('.artist-list').hide();

  $('.searchfld').on('keypress', function(){
  //  event.stopPropagation();
    $(this).closest('.col-xs-6').find('.artist-list').slideToggle();
  })

  $('.heading').addClass('animated bounceIn');
  // $('.shittyLogo').animate({opacity: 0}, 1000);
  // $('.shittyLogo:hidden:first').animate({opacity: 1}, 1000);

  $(function() {
      $('#navigation-bar ul').hide();
      var pull = $('#pull');
          menu = $('#navigation-bar ul');
          menuHeight  = menu.height();
      $(pull).on('click', function(e) {
          e.preventDefault();
          menu.slideToggle();
      });
  });

  var $window = $(window),
      $nav = $('#navigation-bar'),
      $button = $('#pull');

      $button.on('click', function (){
          $nav.slideToggle();
      });

      $window.on('resize', function (){
          if ($window.width() > 400){
              $nav.show();
          }
      });
});
