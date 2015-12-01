//收货地址全部交互
var addressInput = '#realname, #add_province, #add_city, #address, #zipcode, #phone';

    //鼠标进入时增加样式
	$('#ui-setAddress').on('mouseenter', '.shipadd_list li', function(event) {
		var that = $(this);
		that.addClass('current');
	});
	//鼠标离开时删除样式
	$('#ui-setAddress').on('mouseleave', '.shipadd_list li', function(event) {
		var that = $(this);
		that.removeClass('current');
	});
//删除收货人地址
function delAddress(id) {
    var _data = id;
    var _die =$('.shipadd_list li input').val();
		$('.shipadd_list li#' + _die).remove();
   $.ajax({///ShoppingCart/delStuAddress
       url: 'http://html04.xesimg.com/del.json',
       type: 'POST',
       dataType: 'json',
       data: {id: _data},
       success:function(result){
        var resData = xue.ajaxCheck.JSON(result);
       }
   })
}
//提交生成收货地址列表
function saveNewAddress(inputs){
    var input = inputs || $(addressInput);
    var data = { id : 0 };
    data.id = $('#add_id').val();

    var id;
    inputs.each(function(){
        id = this.id;
        id = id.replace('add_', '');
        data[id] = $(this).val();
    });

    data['province_text'] = $('#add_province option:checked').text();
    data['city_text'] = $('#add_city option:checked').text();
    data['country_text'] = $('#add_country option:checked').text();

    var _tpl =  '  <input type="hidden" '
                +'      data-phone="$phone$" '
                +'      data-zipcode="$zipcode$" '
                +'      data-address="$address$" '
                +'      data-area="$province_text$ $city_text$ $country_text$" '
                +'      data-county="$country$" '
                +'      data-city="$city$" '
                +'      data-province="$province$" '
                +'      data-realname="$realname$" '
                +'      value="$id$" '
                +'      name="data[addid]" '
                +'      id="addid_$id$"'
                +'  />'
                +'<div class="consignee_item current">'
                +'  <span>$realname$ $province_text$</span>'
                +'</div>'
                +'<div class="addr_detail">'
                +'  <span class="addr_name" title="$realname$">$realname$</span>'
                +'  <span class="addr_info" title="$province_text$ $city_text$ $country_text$ $address$">$province_text$ $city_text$ $country_text$ $address$</span>'
                +'  <span class="addr_tel">$phone$</span>'
                +'</div>'
                +'<div class="ship_btns">'
                +'  <a class="setdefault_consignee" href="#none">设为默认地址</a>'
                +'  <a class="edit_consignee" href="javascript:updateAddress($id$);">编辑</a>'
                +'  <a class="del_consignee" href="#none" onclick="delAddress($id$)">删除</a>'
                +'</div>';
             

    var o = {
        id : data.id,
        realname : data.realname,
        province_id : data.province,
        city_id : data.city,
        country_id : data.country,
        address : data.address,
        zipcode : data.zipcode,
        phone : data.phone
    };
    $.ajax({
        url : 'addr.json',
        type: 'POST',
        dataType:'json',
        data : o,
        success:function(result){
            if(!result.sign){
                return;
            }
            var _id = result.addId;
            var tp = _tpl;
            tp = tp.replace(/\$id\$/g, _id);
            tp = tp.replace(/\$phone\$/g, data.phone);
            tp = tp.replace(/\$zipcode\$/g, data.zipcode);
            tp = tp.replace(/\$address\$/g, data.address);
            tp = tp.replace(/\$country\$/g, data.country);
            tp = tp.replace(/\$city\$/g, data.city);
            tp = tp.replace(/\$province\$/g, data.province);
            tp = tp.replace(/\$realname\$/g, data.realname);
            tp = tp.replace(/\$province_text\$/g, data.province_text);
            tp = tp.replace(/\$city_text\$/g, data.city_text) 
            tp = tp.replace(/\$country_text\$/g, data.country_text);
        
            if(result.type === 1){
                $('<li id="'+_id+'">'+ tp + '</li>').prependTo('ul.shipadd_list');
            }else if(result.type === 2){
                 $('#addid_'+data.id).parent().html(tp);
             }
            $('.info_from').hide();
        }
    });
}
//编辑收货人地址
function updateAddress(id){
		    $(addressInput).removeClass('error');
		    $('.error_tips_address').empty();
		    var box = $('#addid_' + id);
		    if(box.length == 0){ return ; }
		    var data = box.data();
		    var inputs = $(addressInput);
		    inputs.each(function(){
		        var _id = this.id;
		            _id = _id.replace('add_','');
		        if(this.id == 'add_province' || this.id == 'add_city' || this.id == 'add_country'){
		            $(this).find('option[value="' + data[_id] + '"]').prop('selected', true);
		            $('#' + _id).val(data[_id]);
		        }else{
		            $(this).val(data[_id]);
		        }
		    });
		    renderAreaSelect();
		    $('#add_id').val(id);
		    var newAddress = $('#details_form');
		    newAddress.show();
		   
		}
 // 保存收货地址
 $('body').on('click','#address_submit_btn', function() {
     var inputs = $(addressInput),
         errorbox = $('.error_tips_address');

     var ids = {
         realname: '收货人姓名',
         province: '省份',
         city: '城市',
         country: '地区',
         address: '详细地址',
         zipcode: '邮政编码',
         phone: '手机',
         add_province: '省份',
         add_city: '城市',
         add_country: '地区'
     };
     var _reg = {
         phone: (/^(13|15|18)[0-9]{9}$/.test($('#phone').val()) ? true : false),
         zipcode: (/^[0-9][0-9]{5}$/.test($('#zipcode').val()) ? true : false)
     };
     //邮编
     var id, error = [],
         error_text = '',
         tpl = '$input$ 不能为空',
         error_reg = [],
         reg_text = '';
     inputs.each(function() {
         id = this.id;
         if ($(this).val() === '') {
             error.push(ids[id]);
             $(this).addClass('error');
         } else {
             // 判断手机号与邮编格式
             if (id == 'phone' || id == 'zipcode') {
                 if (!_reg[id]) {
                     error_reg.push(ids[id]);
                     reg_text += ids[id];
                     $(this).addClass('error');
                 } else {
                     $(this).removeClass('error');
                 }
             } else {
                 $(this).removeClass('error');
             }

         }
     });
     var temp_text = '';
     if (error.length > 0) {
         error_text = error.toString();
         temp_text = tpl.replace('$input$', error_text);
     }
     // 判断手机号与邮编格式
     if (error_reg.length > 0) {
         reg_text = error_reg.toString() + '格式不正确';
         if (error.length > 0) {
             temp_text += ', ';
         }
         temp_text += reg_text;
     }
     if (temp_text != '') {
         errorbox.text(temp_text);
         return;
     }
     errorbox.empty();
     saveNewAddress(inputs);

 });
 // 新增收货人地址显示或隐藏
    $('.newCreateAddress').on('click', function(){
        var newAddress = $('#details_form');
        if(newAddress.is(':hidden')){
        	newAddress.show();
        	$(addressInput).val('');
        }else{
        	newAddress.hide();
        }
    });