jQuery(document).ready(function(){
    jQuery('.c-skillbar').each(function(){
        jQuery(this).find('.c-skillbar__bar').animate({
            width:jQuery(this).attr('data-percent')
        },100);
    });

});