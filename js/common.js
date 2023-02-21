
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
//get new select

//API drones
function getData(data) {
  var productTitle = data.title;
  var productPrice = data.price;
  var productId = data.id;
  return {
    title: productTitle,
    price: productPrice,
    id: productId
  };
}
//Get Drones
$.getJSON("//alldrones.ru/backend/api/drones").done(function (data) {
  var allProducts = data.data.map(function (item) {
    return getData(item);
  });

  $.each(allProducts, function (index, item) {
    var $block = $('<option>').attr('drone-id', item.id);
    $block.append( item.title );
    $('#get_drones').append($block);

  });
});

$('.js-example-basic-single').change(function(){
	var droneSelect = $(this).find('option:selected').attr('drone-id');
	//Get services
	$.getJSON("//alldrones.ru/backend/api/services/" + droneSelect, function(data) {
		var select = $(".special-search");
		select.empty();
		$.each(data, function(index, category) {
			var optgroup = $("<optgroup></optgroup>");
			optgroup.attr("label", category.name);
			$.each(category.services, function(index, service) {
				var option = $("<option></option>");
				option.attr("value", service.name);
				option.attr("data-price", service.price);
				option.attr("data-id", service.id);
				option.text(service.name);
				optgroup.append(option);
			});
			select.append(optgroup);
		});
	});
	//Get parts
	$.getJSON("//alldrones.ru/backend/api/parts/" + droneSelect, function(data) {
  $('#parts').empty(); // очищаем элемент перед добавлением новых опций
  var $empty = $('<option>Для этой модели не найдено запчастей</option>');
  $.each(data, function (index, item) {
    var $block1 = $('<option>').attr('part-id', item.id);
    $block1.append(item.title);
    $('#parts').append($block1);
  });
  // проверяем наличие опций
  if ($('#parts').children().length === 0) {
    $('#parts').append($empty);
  }
});
});

//End drones
//API Services
	
//End services

//Customize select tags
function select2tags() {
  var tags = [],
    placeholder = 'Select an option';
  
  $(".special-search").each(function(i) {
    $t = $(this).attr("data-select", i);

    $t.select2({
        id: -1,
        placeholder: placeholder
      })
      .on("select2:select", function(e) {
        var selected = {
          value: e.params.data.text,
          select: $(this).attr("data-select")
        };
        tags.push(selected);
      
        $(this).next().find('.select2-selection__custom').html(selected.value + ' (' + $(this).val().length + ')');

        displayTags();
      })
      .on("select2:unselect", function(e) {
        var selected = {
          value: e.params.data.text,
          select: $t.attr("data-select")
        };

        foundObj = findObjectByKey(tags, "value", selected.value);
        indexToDelete = tags.indexOf(foundObj);
        tags.splice(indexToDelete, 1);
      
        val = $(this).val()[0] == undefined ? placeholder : $(this).val()[0] + ' (' + $(this).val().length + ')'
        $(this).next().find('.select2-selection__custom').html(val);

        displayTags();
      
        setTimeout(function(){
          $('.select2-dropdown').parent().remove();
        }, 1);
      });
    
    // Adding Fake Selection Placeholder
    $('<div class="select2-selection__custom">' + placeholder + '</div>').appendTo($t.next().find('.select2-selection'));
  });
  
  
  // DELETE TAGS
  $(".choisen-list").on("click", ".tag", function() {
    var selected = {
      value: $(this).find(".value").text(),
      select: $(this).attr("data-select")
    };
    foundObj = findObjectByKey(tags, "value", selected.value);
    indexToDelete = tags.indexOf(foundObj);
    
    tags.splice(indexToDelete, 1);

    values = $('select[data-select="' + selected.select +'"]').val();
    values.splice(values.indexOf(selected.value), 1);
    
    $('select[data-select="' + selected.select +'"]').val(values).trigger('change');
    
    val = values[0] == undefined ? placeholder : values[0] + ' (' + values.length + ')'
    $('select[data-select="' + selected.select +'"]').next().find('.select2-selection__custom').html(val);
    
    $(this).parent().remove();

    return false;
  });
  // DISPLAY TAGS
  function displayTags() {
    $(".choisen-list").html("");

    for (i = 0; i < tags.length; i++) {
      $('<li><a href="#" class="tag" data-select="' + tags[i].select + '"><span class="value select-choice-remove">' + tags[i].value + "</span><button class='select-choice-remove' type='button'></button></a></li>").appendTo($(".choisen-list"));
    }
  }
  
}

function findObjectByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
}

select2tags();

$('.js-example-basic-single').select2({
	minimumResultsForSearch: -1,
});
$(".special-search").select2({
	tags: "false",
  placeholder: "Например: замена лопастей",
  allowClear: true,
	minimumResultsForSearch: 1,
	language: {
    noResults: function () {
      return "Ничего не найдено";
    }
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
