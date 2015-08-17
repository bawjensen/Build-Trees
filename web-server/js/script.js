$(function() {
    $('#search').keyup(function(evt) {
        if (evt.keyCode === 13) {
            window.location.href = $(this).val();
        }
    });
});