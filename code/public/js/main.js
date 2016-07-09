/*fun jQuery stuff in here*/
$(document).ready(function(){
  $('.artist-list').hide();

  $('.searchfld').on('keypress', function(){
  //  event.stopPropagation();
    $(this).closest('.col-xs-6').find('.artist-list').slideToggle();
  })
});
