$("#service-form").submit(function(){
		$.ajax({
				type: "POST",
				url: "//alldrones.ru/backend/api/service_request",
				data: new FormData(this),
				cache: false,
				contentType: false,
				processData: false,
		}).done(function () {
						console.log('Форма ушла')
						//Тут включить последний Fieldset в форме с окном об успешной отправке
				});
				
				return false;
			});
$('#check_nalog').on('click', function(){
	$('.controls input:text, .controls select').attr('disabled', $(this).is(':checked'));       
	$('.controls').toggleClass('disable_inputs')
});
$(document).mouseup(function (e) {
	var container = $(".popup-dialog");
	if (container.has(e.target).length === 0){
			$('.popup').removeClass('active');

	}
});
$('.toggle-button').click(function(){
	$(this).toggleClass('active');
	$('header').toggleClass('active');
	$('.toggle-widget').toggleClass('active');
	$('body').toggleClass('lock');
})
$('.contact').click(function(e){
	$('body').addClass('lock')
	$('.for-contact').addClass('active')
	e.preventDefault();
})
$('.btn-close').click(function(){
	$('body').removeClass('lock')
	$('.popup').removeClass('lock')
})

$('.btn-close').click(function(){
	if ($(this).parent().parent().parent().hasClass("active")) {
		$(this).parent().parent().parent().removeClass("active");
		$('body').removeClass('lock');
	} else {
		$('body').removeClass('lock');
	}
})
var swiper = new Swiper(".product-carousel", {
	slidesPerView: 1.2,
	watchOverflow: true,
  spaceBetween: 16,
	loop: false,
	breakpoints: {
		576: {
			slidesPerView: 2.2,
			spaceBetween: 16,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 42,
		},
	}
});
function uploadFiles() {
  var files = document.getElementById("file-input").files;
  if (files.length == 0) {
    alert("Please first choose or drop any file");
    return;
  }
  var filenames = "";
  for (var i = 0; i < files.length; i++) {
    filenames += files[i].name + "\n";
  }
  alert("Selected file: " + filenames);
}

function dragOverHandler(ev) {
  console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
         alert("Selected file: " + file.name);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
    }
  }
}
$('#file_upload').change(function() {
  var i = $(this).next('div').clone();
  var file = $('#file_upload')[0].files[0].name;
  $(this).next('div').text(file);
});

// only to show it did change
$('#file-upload').on('change', function upload(evt) {
  console.log(this.files[0]);
});

// only to show where is the drop-zone:
$('.upload-container label').on('dragenter', function() {
  this.classList.add('dragged-over');
})
 .on('dragend drop dragexit dragleave', function() {
  this.classList.remove('dragged-over');
});


//form switch steps
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next-form").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent().parent();
	next_fs = $(this).parent().parent().next();
	
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
        'transform': 'scale('+scale+')',
				/*        'position': 'absolute'*/
      });
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 300, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
	});
});

$(".previous-form").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent().parent();
	previous_fs = $(this).parent().parent().prev();
	
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 300, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 

	});
});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});

$('.action-button').click(function () {
	$('body,html').animate({
			scrollTop: 0
	});
	return false;
});
