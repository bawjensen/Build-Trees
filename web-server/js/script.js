$(function() {
    function navigateTo(newHash) {
        window.location.hash = newHash;
        $('#search').blur();
    }

    $('#search').keyup(function(evt) {
        if (evt.keyCode === 13) { // Hit 'enter' in the search field
            var champName = $(this).val().toLowerCase();
        
            if (champNameList[champName]) { // If the input is a valid champion name
                navigateTo('/' + champName); // Redirect to that page
            }
            else {
                var regexMatch = new RegExp('^' + champName, 'i');
                var possibilities = $('datalist#champions option').filter(function() { return this.value.match(regexMatch); });
                if (possibilities.length) { // If the input is a partial match
                    $(possibilities[9]).click();
                    navigateTo('/' + possibilities[0].value.toLowerCase()); // Redirect to the first partial match
                }
                else {
                    alert('"' + champName + '" wasn\'t a valid champion name search'); // Else yell at them
                }
            }
        }
    });
});