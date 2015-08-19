$(function() {
    $('#search').keyup(function(evt) {
        if (evt.keyCode === 13) {
            var champName = $(this).val().toLowerCase();
            if (champNameList[champName]) {
                window.location.href = champName;
            }
            else {
                var regexMatch = new RegExp('^' + champName, 'i');
                var possibilities = $('datalist#champions option').filter(function() { return this.value.match(regexMatch); });
                if (possibilities.length) {
                    $(possibilities[9]).click();
                    window.location.href = possibilities[0].value.toLowerCase();
                }
                else {
                    alert('"' + champName + '" wasn\'t a valid champion name search');
                }
            }
        }
    });
});