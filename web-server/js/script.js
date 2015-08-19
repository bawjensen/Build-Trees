$(function() {
    $('#search').keyup(function(evt) {
        if (evt.keyCode === 13) {
            var champName = $(this).val().toLowerCase();
            if (champNameList[champName]) {
                window.location.href = champName;
            }
            else {
                alert('"' + champName + '" wasn\'t a valid champion name search');
            }
        }
    });
});