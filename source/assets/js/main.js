var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Dansk',           ['da-DK']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Filipino',        ['fil-PH']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Lietuvių',        ['lt-LT']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenščina',     ['sl-SI']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Tiếng Việt',      ['vi-VN']],
 ['Türkçe',          ['tr-TR']],
 ['Ελληνικά',        ['el-GR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['Українська',      ['uk-UA']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['हिन्दी',            ['hi-IN']],
 ['ภาษาไทย',         ['th-TH']]];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 28;
updateCountry();
//select_dialect.selectedIndex = 6;
showInfo('info_start');

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
    start_img.src = 'assets/img/mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'assets/img/mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'assets/img/mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 99999) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'assets/img/mic.gif';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
      createEmail();
    }
  };
  var flagFindCtr = false;
  var before_interim_transcript = "";
  recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
	//interim_transcript = interim_transcript.replace(before_interim_transcript);
	//before_interim_transcript = interim_transcript;
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    //interim_span.innerHTML = linebreak(interim_transcript);
	console.dir("final_transcript:"+final_transcript);
	console.dir("interim_transcript:"+interim_transcript);
    if (final_transcript || interim_transcript) {
      //showButtons('inline-block');
    }
	if (final_transcript != '') {
		final_transcript = final_transcript.replace(backft, "");
		backft = final_transcript;
	}
	controlV(final_transcript);
	
  };
}
var backft = "";
var lastCM = "";
var listkey = [/*0*/"xoa", /*1*/"tim kiem", /*2*/"ho so", /*3*/"dong cua so", /*4*/"ket qua 1", /*5*/"ket qua 2", /*6*/"ket qua 3", /*7*/"ket qua 4", /*8*/"ke tiep", /*9*/"ket thuc", /*10*/"chi tiet ", /*11*/"nop don"];
function controlV(strV){
	
	var flagCV = false;
	if (strV == "") {
		console.dir("text_final rong:"+strV);
		// reset flag
		flagFindCtr = false;
		$(".s-loading").hide();
		console.dir("finish");
	}
	// finish
	else {
		$(".s-loading").show();
		console.dir("final != rong: "+ strV);
		var text_final = strV;
		if (flagFindCtr != true) {
			
			var str = convertVnToE(text_final);
			str = str.trim();
			console.dir('flagFindCtr != true ->chi tiet:'+str);
			console.dir("sau convertVNtoE");
			console.dir("--->"+str);
			console.dir(str.indexOf("xoa"));
			if(checkCM (str, listkey[0])) {
				document.getElementById("final_span").value = "";
			} else if(checkCM (str, listkey[1])) {
				$(".btn-search").trigger("click");
				$(".btn-search").trigger("click");
			} else if(checkCM (str, listkey[2])) {
				$("#s-CV").trigger("click");				
			} else if(checkCM (str, listkey[3])) {
				
				$(".modal").trigger("click");
			} else if(checkCM (str, listkey[4])) {
				if(flagCV != true) {
					if($('.q1').hasClass("active")) 
						$('#1a').prop('checked', true);
					if($('.q2').hasClass("active"))
						$('#2a').prop('checked', true);
					if($('.q3').hasClass("active"))
						$('#3a').prop('checked', true);					
					flagCV = true;
				}					
			}  else if(checkCM (str, listkey[5])) {
				if(flagCV != true) {
					if($('.q1').hasClass("active")) 
						$('#1b').prop('checked', true);
					if($('.q2').hasClass("active"))
						$('#2b').prop('checked', true);
					if($('.q3').hasClass("active"))
						$('#3b').prop('checked', true);					
					flagCV = true;
				}					
			}  else if(checkCM (str, listkey[6])) {
				if(flagCV != true) {
					if($('.q1').hasClass("active")) 
						$('#1c').prop('checked', true);
					if($('.q2').hasClass("active"))
						$('#2c').prop('checked', true);
					if($('.q3').hasClass("active"))
						$('#3c').prop('checked', true);					
					flagCV = true;
				}					
			} else if(checkCM (str, listkey[7])) {
				if(flagCV != true) { 					
					$(".modal").trigger("click");				
					flagCV = true;
				}					
			} else if(checkCM (str, listkey[8])) {
				if(flagCV != true) { 
					if($('.q1').hasClass("active")) 
						$(".btn-next-1").trigger("click");		
					if($('.q2').hasClass("active"))
						$(".btn-next-2").trigger("click");		
					if($('.q3').hasClass("active"))
						$(".btn-next-3").trigger("click");
							
					flagCV = true;
				}					
			} else if(checkCM (str, listkey[9])) {
				if(flagCV != true) { 				
					$(".modal").trigger("click");			
					flagCV = true;
				}					
			}  else if(checkCM (str, listkey[10])) { 
				console.dir('###chi tiet:'+str);
				if(str != null && str != "") {
					var sub_str = str.replace(listkey[10], "");
				}
				console.dir('###chi tiet sub_str:'+sub_str);
				var id = "#id-" + parseInt(sub_str);
				console.log(id);
				$(id).trigger("click");			
				flagCV = true;
			} else if(checkCM (str, listkey[11])) { 				
				$("#apply").trigger("click");
			}			
		}
		
		//alert("finish");
		console.log(str);
		if(flagFindCtr != true && !isStrInArr(str, listkey)) {
			//document.getElementById("final_span").value = "";
			$("#final_span").val((text_final));
			$(".btn-search").trigger("click");
			$(".btn-search").trigger("click");
			lastCM = "";
		}
		
		console.dir("text_final rong:"+strV);
		// reset flag
		flagFindCtr = false;
		$(".s-loading").hide();
		console.dir("finish");
	}
}
function isStrInArr(str, arr) {
	for (i = 0; i < arr.length; i++) { 
		if (str.indexOf(arr[i]) != -1) {
			return true;
		}
	}
	return false;
}
function checkCM (str, key) {
	if(str.indexOf(key) != -1) {
		if (lastCM != key) {
			flagFindCtr = true;
			lastCM = key;
			console.dir("##########find key:"+key);
			return true;
		}
		else {
			// delete
			return false;
		}
		
	}
	return false;
}
function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function createEmail() {
  var n = final_transcript.indexOf('\n');
  if (n < 0 || n >= 80) {
    n = 40 + final_transcript.substring(40).indexOf(' ');
  }
  var subject = encodeURI(final_transcript.substring(0, n));
  var body = encodeURI(final_transcript.substring(n + 1));
  window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
}

function copyButton() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  copy_button.style.display = 'none';
  copy_info.style.display = 'inline-block';
  showInfo('');
}

function emailButton() {
  if (recognizing) {
    create_email = true;
    recognizing = false;
    recognition.stop();
  } else {
    createEmail();
  }
  email_button.style.display = 'none';
  email_info.style.display = 'inline-block';
  showInfo('');
}
function restartRecognition () {
	recognition.stop();
	recognition.start();
}
recognition.start();
function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'assets/img/mic-slash.gif';
  showInfo('info_allow');
  //showButtons('none');
  start_timestamp = event.timeStamp;
}

function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}

function convertVnToE(str) { 		
	str= str.toLowerCase();
	str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
	str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
	str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
	str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
	str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
	str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
	str= str.replace(/đ/g,"d");
	str= str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g," ");
	str= str.replace(/ + /g," "); 
	str= str.replace(/^\-+|\-+$/g,"");
	return str;
}
//HACK START//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var FancyWebSocket = function(url)
{
	var callbacks = {};
	var ws_url = url;
	var conn;

	this.bind = function(event_name, callback){
		callbacks[event_name] = callbacks[event_name] || [];
		callbacks[event_name].push(callback);
		return this;// chainable
	};

	this.send = function(event_name, event_data){
		this.conn.send( event_data );
		return this;
	};

	this.connect = function() {
		if ( typeof(MozWebSocket) == 'function' )
			this.conn = new MozWebSocket(url);
		else
			this.conn = new WebSocket(url);

		// dispatch to the right handlers
		this.conn.onmessage = function(evt){
			dispatch('message', evt.data);
		};

		this.conn.onclose = function(){dispatch('close',null)}
		this.conn.onopen = function(){dispatch('open',null)}
	};

	this.disconnect = function() {
		this.conn.close();
	};

	var dispatch = function(event_name, message){
		var chain = callbacks[event_name];
		if(typeof chain == 'undefined') return; // no callbacks for this event
		for(var i = 0; i < chain.length; i++){
			chain[i]( message )
		}
	}
};
////////////////////
var Server;
function log( text ) {
	console.dir(text);
}
/*
function send( text ) {
	Server.send( 'message', text );
}
*/
$(document).ready(function() {
	log('Connecting...');
	Server = new FancyWebSocket('ws://192.168.1.133:9300');
/*
	$('#message').keypress(function(e) {
		if ( e.keyCode == 13 && this.value ) {
			log( 'You: ' + this.value );
			send( this.value );

			$(this).val('');
		}
	});
*/
	//Let the user know we're connected
	Server.bind('open', function() {
		log( "Connected." );
	});

	//OH NOES! Disconnection occurred.
	Server.bind('close', function( data ) {
		log( "Disconnected." );
	});

	//Log any messages sent from server
	Server.bind('message', function( payload ) {
		log( payload );
		//alert(payload);
		controlV(payload);
		//alert(hkkeyword);
	});

	Server.connect();
});
//HACK END//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
