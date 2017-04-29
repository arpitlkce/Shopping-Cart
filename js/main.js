//OOJS class definition
product = function(){}

//prototyping
product.prototype = {
	compArray : [],
	type:"All",
	masterData:[],
	modalUpdate:[],
	index:0,
	init:function(){	
		prod.homePageSetUp();
	},


//Method for getting json data from Server and render on UI
homePageSetUp:function(){
	//AJAX for getting car list
	$.ajax({
	url:'cart.json',
	method:'GET',
	dataType:'json',
	success:function(data){
		console.log(data);
		prod.masterData = data;
		prod.renderCart(data.productsInCart);

	},
	error:function(data){
		console.log("error");
	}
});

// In Modal Size and Quantity selection logic
$(document).on('change', 'select',function (e) {
	var selector = e.target.id;
	var selected = $('select#'+selector+' option:selected');
	if(selector == "qty"){prod.modalUpdate.p_quantity = selected.text();}
	else {
		prod.modalUpdate.p_selected_size.code = selected.val();
		prod.modalUpdate.p_selected_size.name = selected.text();
	}
	
});

$(document).on('click', '#removeItem',function (e) {
	var removedItem = e.target.parentElement.id;
	$.each(prod.masterData.productsInCart,function(index,value){
			if( removedItem === value.p_id) {
				prod.masterData.productsInCart.splice(index,1)
				return false;
			}
		});	
	prod.renderCart(prod.masterData.productsInCart);

});
	
	// In Modal Color selection logic
	$(document).on('click', '.square', function (e) {
		console.log(e);
		prod.modalUpdate.p_selected_color.hexcode = e.target.style.backgroundColor;
		prod.modalUpdate.p_selected_color.name = e.target.nextSibling.innerHTML;
	});
	
	// this event handler get invoked at the time of modal closing.
	// update master data and send to server
	$(document).on('click', 'button#closeModal', function () {
		
		prod.masterData.productsInCart.splice(prod.index,1);
		prod.masterData.productsInCart.push(prod.modalUpdate);
		prod.renderCart(prod.masterData.productsInCart);

		console.log(prod.masterData);
//Ajax call to send data to REST API's once your Modal updation is done.
 	//$.ajax({
	//url:'cart1.json',
	//method:'PUT',
    //contentType:"application/json",
    //dataType: "json", 
	//data:JSON.stringify(prod.masterData),
	//success:function(data){
		//console.log("success");
	//},
	//error:function(data){
		//console.log("error");
	//}
	//});
	  $('#myModal').modal('hide');

});

// this click event open modal and populate modal with their respective row data
	$(document).on('click', 'a#editModal',function (e) {
		console.log(e.target.parentElement.id);
		var modalData = "";
		$.each(prod.masterData.productsInCart,function(index,value){
			if(e.target.parentElement.id == value.p_id){
				modalData = value;
				prod.index=index;
				return false;
			}
		});
		 prod.modalUpdate = modalData;
		
		$('#myModal .modal-body').empty();

		// Extract the text from the template .html() is the jquery helper method for that
      	var raw_template = $('#modal-template').html();
      	// Compile that into an handlebars template
     	 var template = Handlebars.compile(raw_template);

      	 var context = {"modalData":modalData};
     	 // Generate the HTML for the template
     	 var content = template(context);

  	$('#myModal .modal-body').append(content);
  	$('#myModal').modal('show');
})
	
},

//Render Cart details on Home Page dynamically
renderCart:function(data){
	$('#tableCart tbody').empty();
	var raw_template = $('#row-template').html();
     // Compile that into an handlebars template
    var template = Handlebars.compile(raw_template);

    var context = {"data":data};
     // Generate the HTML for the template
    var content = template(context);
    $('#tableCart tbody').append(content);

	prod.UpdateTotalPrice(data);
},


//method for discount,total,subtotal calculation
UpdateTotalPrice:function(data) {
	var sum = data.reduce(function(a, b) {return a + b.p_price*b.p_quantity;}, 0);
	
	var cartSize = data.length;
	var discount = "";
	document.getElementById('subtotal').innerHTML = '<sup>$</sup>'+sum.toFixed(2);
	if(cartSize == 3){discount = 5}
	else if(cartSize > 3 && cartSize <= 6){discount = 10}
	else if(cartSize > 10){discount = 25}
	else discount = 0;
	var reducedTotal = discount * sum/100;
	document.getElementById('promo').innerHTML = ' - <sup>$</sup>'+reducedTotal.toFixed(2);
	document.getElementById('finalTotal').innerHTML = '<sup>$</sup>'+(sum-reducedTotal).toFixed(2);;
	$('.image').html(cartSize+' Items');
}
}


// creating instance of class
var prod = new product();

//calling init method class using reference
prod.init();
