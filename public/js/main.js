/*fun jQuery stuff in here*/
$(document).ready(function(){
  $('.artist-list').hide();

  $('.searchfld').on('keypress', function(e){
  //  event.stopPropagation();
    $(this).closest('.col-xs-6').find('.artist-list').slideToggle();
    //
    // if(e.keyCode == 13){
    //   $('#findMatches').trigger('click')
    // }

  })

  $('.heading').addClass('animated bounceIn');
  // $('button').addClass('animated pulse')
  // $('.shittyLogo').addClass('animated bounceIn');
  // $('.shittyLogo').animate({opacity: 0}, 1000);
  // $('.shittyLogo:hidden:first').animate({opacity: 1}, 1000);

  $('.btn#findMatches').click(function(){
  $('#findMatches').click(function(){
    var artist1 = $('#searchfld1').attr('value');
    console.log(artist1)
    var artist2 = $('#searchfld2').attr('value');
    console.log(artist2)
    console.log('ARTISTS:'+ artist1,artist2)
    window.location.href = '/search?artist1='+encodeURIComponent(artist1)+"&artist2="+encodeURIComponent(artist2);
  })
  //
  // $('#findMatches').click(function(){
  //   var artist1 = $('#searchfld1').attr('value');
  //   var artist2 = $('#searchfld2').attr('value');
  //   console.log('ARTISTS:'+ artist1,artist2)
  //   window.location.href = '/search?artist1='+encodeURIComponent(artist1)+"&artist2="+encodeURIComponent(artist2);
  // })

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
