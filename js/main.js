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
		var availSizes ="";
		var availColors ="";
		$.each(prod.masterData.productsInCart,function(index,value){
			if(e.target.parentElement.id == value.p_id){
				modalData = value;
				prod.index=index;
				return false;
			}
		});
		prod.modalUpdate = modalData;
		$.each(modalData.p_available_options.sizes,function(index,value){
			availSizes = availSizes + '<option value='+value.code+'>'+value.name+'</option>';
		});
		$.each(modalData.p_available_options.colors,function(index,value){
			availColors = availColors + '<div class="squareHolder"><button class="square" style="background-color:'+value.hexcode+'"></button><div class="squareDesc">'+value.name+'</div></div>'
		});
		
		console.log(prod.masterData.productsInCart);
		$('#myModal .modal-body').empty();
		var content = '<div class="product-details">\
						<div class="col-sm-7  col-xs-7">\
							<div class="product-information">\
							<ul>\
							<hr/>\
							<li><h2 class="nameHeading">'+modalData.p_name+'</h2></li>\
							<li><div><sup>$</sup><span class="modalPrice">'+modalData.p_price+'<span></div></li>\
							<hr/>\
							<li><h2 class="nameDetails">'+modalData.p_name+'</h2></li>\
							<li><div class="squareBox1">'+availColors+'</div></li>\
							<li>\
							<div class="btn-group squareBox">\
							<select id="size">'+availSizes+'\
							</select>\
							</div>\
							<div class="btn-group">\
							<select id="qty">\
							  <option value="1">1</option>\
							  <option value="2">2</option>\
							  <option value="3">3</option>\
							  <option value="4">4</option>\
							</select>\
							</div>\
							</li>\
							<li><button type="button"  id = "closeModal" class="btn btn-default editButton noRadius ">Edit</button></li>\
							<li><a>See Product details</a></li>\
							</ul>\
							</div>\
						</div>\
						<div class="col-sm-5 col-xs-5">\
							<div class="view-product">\
							</div>\
						</div>\
					</div>';
		
  $('#myModal .modal-body').append(content);
  $('#myModal').modal('show');
})
	
},

//Render Cart details on Home Page dynamically
renderCart:function(data){
	var cartSize = 0;
	var subTotal = 0;
	$('#tableCart tbody').empty();
	$.each(data,function(index,value){
		var row = '<tr> \
							<td class="col-sm-3 col-xs-7 cart_product">\
								<a href=""><img src="assets/T1.jpg" alt=""></a>\
							</td>\
							<td class="col-sm-6 col-xs-2 cart_description">\
								<h4><a href="">'+value.p_variation+' '+value.p_name+'</a></h4>\
								<p>Style #: '+value.p_style+'</p>\
								<p>Color: '+value.p_selected_color.name+'</p>\
								<div class="align" id='+value.p_id+'>\
								<a  id ="editModal" href="#">Edit</a> |\
								<a href="">X Remove</a> |\
								<a href="">Save for Later</a>\</div>\
							</td>\
							<td class=" col-sm-1 col-xs-1 cart_price">\
								<p>'+value.p_selected_size.code+'</p>\
							</td>\
							<td class=" col-sm-1 col-xs-1 cart_quantity">\
								<div class="cart_quantity_button">\
									<input class="cart_quantity_input" type="text" name="quantity" value="'+value.p_quantity+'" autocomplete="off" size="2">\
								</div>\
							</td>\
							<td class=" col-sm-1 col-xs-1 cart_total">\
								<p class="cart_total_price"><sup>'+value.c_currency+'</sup>'+value.p_quantity*value.p_price.toFixed(2)+'</p>\
							</td>\
						</tr>';
						
	$('#tableCart tbody').append(row);
	cartSize = index;
	subTotal += value.p_quantity*value.p_price;
	});
	
	console.log(subTotal,cartSize);
	prod.totalPrice(subTotal,cartSize);
	
	 
},


//method for discount,total,subtotal calculation
totalPrice:function(subTotal,length){
	var discount = "";
	document.getElementById('subtotal').innerHTML = '<sup>$</sup>'+subTotal.toFixed(2);
	if(length == 3){discount = 5}
	else if(length>3 && length<=6){discount = 10}
	else if(length>10){discount = 25}
	else discount = 0;
	var reducedTotal = discount*subTotal/100;
	document.getElementById('promo').innerHTML = ' - <sup>$</sup>'+reducedTotal.toFixed(2);
	document.getElementById('finalTotal').innerHTML = '<sup>$</sup>'+(subTotal-reducedTotal).toFixed(2);;
	console.log('done');
	$('.image').html(length+' Items');
}
}


// creating instance of class
var prod = new product();

//calling init method class using reference
prod.init();
