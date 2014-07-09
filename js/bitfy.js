defaultSettings = {
	regval: [],
	motorola_mod: false,
	basehex: true,
	num_bits: 32
};

$( document ).ready(function() {
	
	/* Hook up all the events */
	$('.num-bits-change').click(function() {
		var settings = getSettings(), maxlength;
		if($(this).text() == '32 Bit') {
			settings.num_bits = 32;
		}
		if($(this).text() == '16 Bit') {
			settings.num_bits = 16;
		}
		if($(this).text() == '8 Bit') {
			settings.num_bits = 8;
		}
		
		saveSettings(settings);
		updateUI();
	});

	$('.base-change').click(function() {
		var settings = getSettings(), maxlength;
		
		if($(this).text() === 'Hex') {
			maxlength = '8';
			settings.basehex = true;
		}
		if($(this).text() === 'Dec') {
			maxlength = '10';
			settings.basehex = false;
		}
		$('[id^=regval]').attr('maxlength', maxlength);
		
		saveSettings(settings);
		updateUI();
	});

	$('input[name="big-endian"]').change(function(e) {
		var settings = getSettings();
		settings.motorola_mode = $('input[name="big-endian"]').prop('checked') ? true : false;
		saveSettings(settings);
		updateUI();
	});

	$('[id^=regval]').on('input', function() {
		var settings = getSettings();
		var base =  settings.basehex ? 16 : 10;
		var newVal = 0;
		
		if($(this).val().match("(?:0[xX])?[0-9a-fA-F]+$") != null) {
			newVal = parseInt($(this).val(), base);
		}

		for(i =0; i < 32; i++) {
			settings.regval[i] = (newVal & (1 << i)) ? 1 : 0;
		}
		updateUI();
	});

	$('.btn-bit:button').click( function() { 
		var regval = getSettings().regval;
		var bit = parseInt($(this).prop('realindex'), 10);
		regval[bit] = (regval[bit] == 0) ? 1 : 0;
		updateUI();
	});

	$('#btn-clr').click( function() {
		var regval = getSettings().regval;
		for(i =0; i < settings.num_bits; i++) {
			regval[i] = 0;
		}
		updateUI();
	});

	$('#btn-reverse').click( function() {
		var regval = getSettings().regval;
		for(i =0; i < settings.num_bits; i++)
			regval[i] = (regval[i] == 0) ? 1 : 0;

		updateUI();
	});

	$('#shift-left').click( function() {
		var regval = getSettings().regval;
		regval.pop();
		regval.unshift(0);
		updateUI();
	});

	$('#shift-right').click( function() {
		var regval = getSettings().regval;
		regval.shift();
		regval.push(0);
		updateUI();
	});

	function getSettings() {
		if(typeof chrome.extension !== 'undefined') {
			return chrome.extension.getBackgroundPage().getSettings();
		}
		return defaultSettings;
	}

	function saveSettings(settings) {
		if(typeof chrome.extension !== 'undefined') {
			return chrome.extension.getBackgroundPage().saveSettings(settings);
		}
		defaultSettings = settings;
	}

	function updateUI() {
		
		var settings = getSettings();
		
		$('.label').each(function( index ) {
			index = 31 - index; 
			if(index > (settings.num_bits - 1)) {
				$(this).css('visibility', 'hidden');
				settings.regval[index] = 0;
				return;
			}

			$(this).css('visibility', 'visible');

			if(settings.motorola_mode) {
				index = (settings.num_bits - 1) - index;
			}
			if(index < 10)
				$(this).html('&nbsp;&nbsp;' + index);
			else
				$(this).html(index);
		});

		$('.btn-bit:button').each(function( index ) {
			var index = parseInt($(this).prop('realindex'), 10);
			
			if(index > (settings.num_bits - 1)) {
				$(this).css('visibility', 'hidden');
				return;
			}
			$(this).css('visibility', 'visible');

			/* Update bit content */
			$(this).text(settings.regval[index].toString());

			if(settings.regval[index] == 0) {
				if( ! $(this).hasClass('btn-default')) {
					$(this).addClass('btn-default');
				}
				if( $(this).hasClass('btn-primary')) {
					$(this).removeClass('btn-primary');
				}
			} else {
				if( $(this).hasClass('btn-default')) {
					$(this).removeClass('btn-default');
				}
				if( ! $(this).hasClass('btn-primary')) {
					$(this).addClass('btn-primary');
				}
			}
		});

		var base = settings.basehex ? 16 : 10;
		var num = 0;

		for(i =0; i < 32; i++) {
			num |= settings.regval[i] << i;
		}

		/* convert to unsigned (stupid javascript) */
		strVal = (num >>> 0).toString(base).replace(/^[0]+/g,"");
		
		if(strVal == '') 
			strVal = '0';


		$('#btn-bits').text(settings.num_bits + ' Bits');
		$('#btn-base').text(settings.basehex ? 'Hex' : 'Dec');
		$('[id^=regval]').focus().val(strVal.toUpperCase());
		
	}

	var settings = getSettings();

	$('.btn-bit:button').each(function( index ) {		
		$(this).prop('realindex', (31 - index));
		settings.regval.push(0);
	});
	
	$('input:checkbox[id=motorola]').prop('checked', settings.motorola_mode);

	updateUI();
	
});

