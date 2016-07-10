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
});
