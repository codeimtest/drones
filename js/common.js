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
	//get fio
/*
	$('.check-fio').click(function(e){
		e.preventDefault(); // Отменяем стандартное поведение отправки формы

    // Получаем данные из input
    var inputValue = $("#my-input").val();

    // Отправляем AJAX запрос
    $.ajax({
      url: "http://alldrones.ru/backend/api/declension",
      method: "POST",
      data: {
        individual_surname: inputValue
      },
      success: function(response) {
        // Обрабатываем ответ сервера в случае успеха
        console.log(response);
      },
      error: function(xhr, status, error) {
        // Обрабатываем ошибки при отправке запроса
        console.error(error);
      }
    });

	})
*/

	//Get Drones
	$.getJSON("//alldrones.ru/backend/api/drones").done(function (data) {
	var allProducts = data.data.map(function (item) {
	return getData(item);
	});
	
	$.each(allProducts, function (index, item) {
	var $block = $('<option>').attr('drone-id', item.id).attr('value', item.id);
	$block.append( item.title );
	$('#get_drones').append($block);
	});
	});
	
	$('#get_drones').change(function(){
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
		
		// ADD price when change services
		$('.special-search').change(function() {
			var selectedOptions = $('.special-search option:selected');
			var total = 0;
			selectedOptions.each(function() {
				var price = $(this).data('price');
				total += price;
			});
			selectedOptions = $('#parts option:selected');
			selectedOptions.each(function() {
				var price = $(this).data('part-price');
				total += price;
			});
			$('#total-price').val(total.toFixed(0)); 
			$('.total-price-value span').text(total.toFixed(0));
		});
	});
	
	//Get parts
	$.getJSON("//alldrones.ru/backend/api/parts/" + droneSelect, function(data) {
		$('#parts').empty(); // очищаем элемент перед добавлением новых опций
		var $empty = $('<option disabled selected="selected">Для этой модели не найдено запчастей</option>');
		var $po = $('<option disabled selected="selected">Выберите модель</option>');
		$.each(data, function(index, item) {
			var $block1 = $('<option>').attr('data-part-price', item.price).attr('value', item.id);
			$('#parts').append($block1);
			$block1.append(item.title, ' ' + item.price + ' руб.');
		});
		
		// ADD price when change parts
		$('#parts').change(function() {
			var selectedOptions = $('.special-search option:selected');
			var total = 0;
			selectedOptions.each(function() {
				var price = $(this).data('price');
				total += price;
			});
			selectedOptions = $('#parts option:selected');
			selectedOptions.each(function() {
				var price = $(this).data('part-price');
				total += price;
			});
			$('#total-price').val(total.toFixed(0)); 
			$('.total-price-value span').text(total.toFixed(0));
		});
	});
	});

//End drones
//API Services
	
//End services
$('.special-search').on('change', function(){
	$(this).find('option').removeClass('added-to-multiple-select');
	$(this).find('option:selected').addClass('added-to-multiple-select');
	$('.select2-results__option').addClass('added-to-multiple-select')
});

//form switch steps and validate
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var dr = $('#get_drones').val();
var prts = $('#parts').val();
var srvs = $('#services-list').val();

$('fieldset .next-form').each(function(){
	$(this).click(function(event){
		// Предотвратить стандартное поведение отправки формы
		event.preventDefault();

		// Получить текущий .tab-content .active
		var activeTabContent = $(this).parents('fieldset').find('.tab-content .active');
		
		// Получить значения полей формы
		var input;
		if (activeTabContent.length) {
			input = activeTabContent.find('.input-validation');
		} else {
			input = $(this).parent().parent().find('.input-validation');
		}

		var isvalid = true;

		input.each(function() {
			if ($(this).val() === '' || ($(this).val() == null) || ($(this).val() == 0)) {
				$(this).parent().append('<p class="error-message">Поле обязательно к заполнению</p>');
				isvalid = false;
			} else {
				$(this).parent().find('.error-message').remove();
			}
		});
		
		if (isvalid) {
			if (animating) return false;
			animating = true;
			
			current_fs = $(this).parent().parent();
			next_fs = $(this).parent().parent().next();
			
			$('.next-step').attr('disabled', false);
			//show the next fieldset
			next_fs.show();
			//hide the current fieldset with style
			current_fs.animate({
				opacity: 0
			}, {
				step: function(now, mx) {
					//as the opacity of current_fs reduces to 0 - stored in "now"
					//1. scale current_fs down to 80%
					scale = 1 - (1 - now) * 0.2;
					//2. bring next_fs from the right(50%)
					left = (now * 50) + "%";
					//3. increase opacity of next_fs to 1 as it moves in
					opacity = 1 - now;
					current_fs.css({
						'transform': 'scale(' + scale + ')',
						/*        'position': 'absolute'*/
					});
					next_fs.css({
						'left': left,
						'opacity': opacity
					});
				},
				duration: 300,
				complete: function() {
					current_fs.hide();
					animating = false;
				},
			});
		}
	})
})

	
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

//Customize select tags
function select2tags() {
  var tags = [],
    placeholder = 'Select an option';
  
  $(".special-search").each(function(i) {
    $t = $(this).attr("data-select", i);

    $t.select2({
        id: 1,
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

//remove services when switch drone
$('#get_drones').change(function(){
	$('.choisen-list').find('li a').click()
})
//init select
$('.js-example-basic-single').select2({
	minimumResultsForSearch: -1,
});
$('.js-example-basic-single-alt').select2({
	tags: "false",
	placeholder: "Например: нижняя часть корпуса",
  allowClear: false,
	minimumResultsForSearch: -1,
	language: {
    noResults: function () {
      return "Ничего не найдено";
    }
  },
	closeOnSelect: false,
});
$(".special-search").select2({
	tags: "false",
  placeholder: "Например: замена лопастей",
  allowClear: false,
	minimumResultsForSearch: 1,
	language: {
    noResults: function () {
      return "Ничего не найдено";
    }
  },
	closeOnSelect: false,
});
//init mask
$('.phone-input').mask('+7 (999) 999-99-99').on('click', function () {
	if ($(this).val() === '_ (___) ___-__-__') {
			$(this).get(0).setSelectionRange(0, 0);
	}
});


//other
//Disable inputs if checkbox is check
$('#check_nalog').on('click', function(){
	$('.controls input:text, .controls select').attr('disabled', $(this).is(':checked'));
	$('.controls').toggleClass('disable_inputs')
});
$('#type').change(function(){
	var companytype = $(this).val();
	if(companytype == 'Ип'){
		$('.input-hidden').hide();
		$('.input-hidden').find('input').val("");
	} else {
		$('.input-hidden').show();
	}
})
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

//progress bar
var fileInput = $('#file_upload');
var progressBar = $('#progressBar');
var progress = progressBar.find('.progress');
var cancelBtn = $('#cancelBtn');
cancelBtn.hide();
fileInput.on('change', function() {
	var file = $(this)[0].files[0];
	if (file) {
		cancelBtn.show();
		var reader = new FileReader();
		reader.onloadstart = function() {
			progress.width('0%');
		};
		reader.onprogress = function(event) {
			var percentLoaded = Math.round((event.loaded / event.total) * 100);
			progress.width(percentLoaded + '%');
		};
		reader.onload = function() {
			progress.width('100%');
			// Do something with the loaded data here
			$('.upload-container label').text('Загружено');
		};
		reader.readAsDataURL(file);
	}
	var i = $(this).next('div').clone();
  var file = $('#file_upload')[0].files[0].name;
  $(this).next('div').next('div').text(file);
});

cancelBtn.on('click', function() {
	fileInput.val('');
	progress.width('0%');
	cancelBtn.hide();
	$('.upload-container label').html('<p>Перетащите файл сюда</p>Выберите на вашем устройстве');
	$('#file_upload').next('div').next('div').text('');
});



$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');
	targettext = $(this).text();
	$('#clent_type').val(targettext)
  $('.tab-content > div').not(target).hide();
	$('.tab-content > div').addClass('active');
	$('.tab-content > div').not(target).toggleClass('active');
	$('.tab-content .active').find("input").val("")
  $(target).fadeIn(600);
  $(this).closest('form').find('#type,#podpis').each(function() {
    $(this).prop('selectedIndex', 0); // сбросить выбранный option на первый по умолчанию
  });
});

$('.action-button').click(function () {
	$('body,html').animate({
			scrollTop: 0
	});
	return false;
});
$('form').submit(function(event) {
    // Отменяем стандартное поведение формы
    event.preventDefault();
    
    // Собираем данные формы
    
    // Отправляем данные на API
    $.ajax({
      type: 'POST',
      url: 'http://alldrones.ru/backend/api/service_request',
      data: new FormData(this),
			cache: false,
			contentType: false,
			processData: false,
      success: function(response) {
        console.log('Успешно отправлено:', response);
      },
      error: function(form_data) {
        console.log('Ошибка отправки:', form_data);
      }
    });
  });
