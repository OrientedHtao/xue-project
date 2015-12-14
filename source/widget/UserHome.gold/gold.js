/**
 * Created by yangmengyuan on 15/10/24.
 */

$(function(){
    var addressInput = '#realname, #add_province, #add_city, #address, #zipcode, #phone';
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
        $.ajax('addr.json',{///shoppingCart/saveStuAdds
            //url : 'addr.json',
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
                tp = tp.replace(/\$city_text\$/g, data.city_text);
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
    // 保存收货地址
    $('body').on('click','#address_submit_btn',function() {
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

//tab切换
    var
        $gdtbtn = $('.gold-detail-title li'),
        $gstbtn = $('.gold-store-title-container li'),
        $getbtn = $('.gold-exchange-title-container li'),
        $gerspan = $('.gold-exchange-rank span');
    $gdtbtn.on("click",function(e){
        var $target = $(e.target);
        var index = $target.index();
        $(this).addClass('active').siblings().removeClass('active gold-detail-title-on');
        //$gdtbtn.removeClass('gold-detail-title-on').eq(index).addClass('gold-detail-title-on');
        var $targetBox = $($target.attr('data-target'));
        $('.gold-detail-block-change').fadeOut(0);
        $targetBox.fadeIn(300);
    });
    $gstbtn.on("click",function(e){
        var $target = $(e.target);
        var index = $target.index();
        $gstbtn.removeClass('gold-store-title-on').eq(index).addClass('gold-store-title-on');
        var $targetBox = $($target.attr('store-target'));
        $('.gold-store-block-change').fadeOut(0);
        $targetBox.fadeIn(300);
    });
    $getbtn.on("click",function(e){
        var $target = $(e.target);
        var index = $target.index();
        $getbtn.removeClass('gold-exchange-title-on').eq(index).addClass('gold-exchange-title-on');
        var $targetBox = $($target.attr('exchange-target'));
        $('.gold-exchange-block-change').fadeOut(0);
        $targetBox.fadeIn(300);
    });
    $gerspan.on('click',function(e){
        var $target = $(e.target);
        var index = $(this).closest('.gold-exchange-rank').find('span').index(this);
        $gerspan.removeClass('gold-exchange-use-focus').eq(index).addClass('gold-exchange-use-focus');
        var $targetBox = $($target.attr('use-target'));
        $('.gold-exchange-use-block-change').fadeOut(0);
        $targetBox.fadeIn(300);
    });
//鼠标移到目标卡片交互

    var
        $gsp = $('.gold-store-present-card-box'),
        $gsc = $('.gold-store-card-box-over'),
        $gep = $('.gold-exchange-present-card-box');

    $gsp.on({
        mouseenter:function(){
            $(this)
                .stop()
                .css({'box-shadow':'0 1px 5px 0px #666'},300)
                .animate({'margin-top':5},300);
        },
        mouseleave:function(){
            $(this)
                .stop()
                .css({'box-shadow':'none'},300)
                .animate({'margin-top':10},300)
        }
    },'.gold-store-present-card');

    $gsc.on({
        mouseenter:function(){
            $(this)
                .stop()
                .css({'box-shadow':'0 1px 5px 0px #666'},300)
                .animate({'margin-top':5},300);
        },
        mouseleave:function(){
            $(this)
                .stop()
                .css({'box-shadow':'none'},300)
                .animate({'margin-top':10},300)
        }
    },'.gold-store-card');
    $gep.on({
        mouseenter:function(){
            $(this)
                .stop()
                .css({'box-shadow':'0 1px 5px 0px #666'},300)
                .animate({'margin-top':5},300);
        },
        mouseleave:function(){
            $(this)
                .stop()
                .css({'box-shadow':'none'},300)
                .animate({'margin-top':10},300)
        }
    },'.gold-exchange-present-card');
//时间插件
    var
        $dateStart = $('#dateStart'),
        $dateEnd = $('#dateEnd'),
        $golddc = $('.gold-detail-check');
    var dateStart,dateEnd;
    if($dateStart.calendar){
        $dateStart.calendar({
            controlId: "dateStartCalendar",
            controlClass:"calendar",
            speed: 200,
            complement: true,
            readonly: true,
            upperLimit: new Date(),
            lowerLimit: new Date("2010/01/01")
        });
        $dateEnd.calendar({
            controlId: "dateEndCalendar",
            controlClass:"calendar",
            speed: 200,
            complement: true,
            readonly: true,
            upperLimit: new Date(),
            lowerLimit: new Date("2010/01/01")
        });
        $golddc.on('click',function(){
            dateStart = $dateStart.val();
            dateEnd = $dateEnd.val();
            //console.log(dateStart);
            //console.log(dateEnd);
            $.ajax({
                url : '/GoldShop/ajaxGetGoldLogs',
                type : 'post',
                dataType : 'html',
                data : {
                    sTime:dateStart,
                    eTime:dateEnd
                }
            })
        })
    }

//实物礼品排序
    var $goldstoreprb = $('.gold-store-present-rank-by'),
        sort_type = '',
        gold_sort = '';
    var $goldstoreprg = $('.gold-store-present-rank-gold'),
        $goldstorega = $('.gold-store-gold-arrow');
    $goldstoreprg.on('click',function(){
        $goldstorega.toggleClass('glyphicon-arrow-down');
    });
    $goldstoreprb.on('click','a',function(){
        $(this).addClass('gold-store-present-rank-focus').siblings().removeClass('gold-store-present-rank-focus');
        var $findi = $(this).find('i').addClass('glyphicon glyphicon-arrow-up').parent().siblings().find('i');
        var $this = $(this).find('em');
        $findi.removeClass('glyphicon glyphicon-arrow-down').removeClass('glyphicon glyphicon-arrow-up');
        if($this.hasClass('gold-store-present-rank-gold')){
            sort_type = 1;
        }else if($this.hasClass('gold-store-present-rank-new')){
            sort_type = 2;
        }
        if ($goldstorega.hasClass('glyphicon-arrow-down')) {
            gold_sort = 2;

        }else if($this.hasClass('gold-store-present-rank-new')){
            gold_sort = '';
        }
        else {
            gold_sort = 1;
        }
        //console.log(sort_type);
        //console.log(gold_sort);
        $.ajax({
            url : '/GoldShop/ajaxGetAwardList',
            type : 'post',
            dataType : 'html',
            data : {
                sort_type : sort_type,
                gold_sort : gold_sort
            }
        })
    })

    var
        $body = $('body'),
        pabLabel = '.present-address-box form label',
        presentAdd = '.present-add',
        presentDec = '.present-dec';

//魔法卡兑换模态框
    var $cardCreateModal = $('.gold-store-card-box');

    $cardCreateModal.on('click','.gold-store-card',function(){
        //goldCardModal.getModal();
        var cardid = $(this).closest('.gold-store-card').attr('id');
        //console.log(cardid);
        $.ajax({
            url : '/GoldShop/magicDetail',
            type : 'post',
            dataType : 'html',
            data : {
                id : cardid
            },
            success : function(result){
                goldCardModal.showModal(result);
            }
        })
    });

    var goldCardModal = goldCardModal || {};

    goldCardModal.showModal = function(con){
        var that = $(this), data = that.data();
        var con = con;

        createModal.show({
            id : 'cardModal',
            width : '740',
            title : '魔法卡兑换',
            cls : 'cardModal bbb',
            content : con
        });

        $('#cardModal').modal('show');

    };

//魔法卡兑换
    $body.on('click','.red-card-exchange',function(){
        var redCardId = $(this).closest('.red-card-box').attr('id'),
            $spam = __uri('img/Spam.png'),
            $rct = $('.red-card-tip');
        var div = $rct.html();
        $.ajax({
            url : '/GoldShop/useMagicCard',
            type : 'post',
            dataType : 'json',
            data : {
                id : redCardId
            },
            success : function(msg,event){
                if(msg.sign == 0){
                    if(div !== ''){
                        event.preventDefault();
                    }else{
                        $rct.append('<div class="alert alert-danger fade in"><img src="'+ $spam +'" class="alertImg"><span>兑换失败,你的金币余额不足哦~</span></div>')
                    }
                }
                if(msg.sign == 1){
                    window.location.href = msg.url;
                }
            }
        })
    });

//实物兑换模态框
    var $presentCreateModal = $('.gold-store-present-card-container');

    $presentCreateModal.on('click','.gold-store-present-card',function(){
        var presentid = $(this).closest('.gold-store-present-card').attr('id');
        $.ajax({
            url : '/GoldShop/realAwardDetail',
            type : 'post',
            dataType : 'html',
            data : {
                id : presentid
            },
            success : function(result){
                goldPresentModal.showModal(result);
            }
        })
    });

    var goldPresentModal = goldPresentModal || {};

    goldPresentModal.showModal = function(con){
        var that = $(this), data = that.data();
        var con = con;
        console.log(data);
        createModal.show({
            id : 'presentModal',
            width : '740',
            title : "实物礼品兑换",
            cls : "presentModal aaa ccc",
            content : con
        });

        $('#presentModal').modal('show');


        $body.on("click",pabLabel, function(e){
            var
                $target = $(e.target),
                $pabLabel = $(pabLabel),
                $pan = $('.present-address-new'),
                $df = $('#details_form'),
                $pe = $('.present-exchange');
            if($target[0].nodeName != 'LABEL'){
                $target = $target.parents('label');
                var index = $target.index();
            }
            $pabLabel.removeClass('present-address-focus').eq(index).addClass('present-address-focus');
            if($pan.hasClass('present-address-focus')){
                $df.show();
                $pe.hide()
            }else {
                $df.hide();
                $pe.show();
            }
        });

        var
        //pig = '.present-intro-gold em',
            $pig = $('.present-intro-gold em'),
            $presentPiece = $('.present-piece em'),
            gold = parseInt($pig.html()),
            piece = parseInt($presentPiece.html()),
            $presentNum = $('.present-num');
        $body.on("click",presentAdd,function(){
            //console.log($pig.length);
            var num = parseInt($presentNum.html());
            if(num > piece - 1){
                $presentNum.html(piece);
                $pig.html(gold * piece);
            }
            else{
                $presentNum.html(num + 1);
                $pig.html(gold * (num + 1));
            }
        });
        $body.on("click",presentDec,function(){
            var num = parseInt($presentNum.html());
            if(num == 1)
            {
                $presentNum.html(num);
                $pig.html(gold);
            }
            else{
                $presentNum.html(num - 1);
                $pig.html(gold * (num - 1));
            }
        });
    };
//实物礼品兑换
    $body.on('click','.present-exchange',function(){
        var
            $pct = $('.present-card-tip'),
            presentId = $(this).closest('.present-box').attr('id'),
            $presentNum = $('.present-num');
        var num = parseInt($presentNum.html());
        var div = $pct.html();
        $.ajax({
            url : '/GoldShop/ajaxExchange',
            type : 'post',
            dataType : 'json',
            data : {
                award_type : 1,
                id : presentId,
                num : num,
                addId : addId
            },
            success : function(msg,event){
                if(msg.sign == 0){
                    if(div !== ''){
                        event.preventDefault();
                    }else{
                        $pct.append('<div class="alert alert-danger fade in"><img src="../../static/img/UserHome.gold/Spam.png" class="alertImg"><span>兑换失败,你的金币余额不足哦~</span></div>')
                    }
                }
                if(msg.sign == 1){
                    window.location.href = msg.url;
                }
            }
        });
    });

//我兑换的 魔法卡兑换列表
    var $goldexr = $('.gold-exchange-rank'),
        is_used = 0;
    $goldexr.on('click','span',function(){
        if($(this).hasClass('gold-exchange-not-use') ){
            is_used = 0;
        }else if($(this).hasClass('gold-exchange-used')){
            is_used = 1;
        }
        $.ajax({
            url : '/GoldShop/ajaxGetMagicExLogs',
            type : 'post',
            dataType : 'html',
            data : {
                is_used : is_used
            }
        })
    });

    var $goldexscon = $('.gold-exchange-show-container');

    $goldexscon.on('click','.gold-exchange-use span',function(){
        var exchangeid = $(this).closest('.gold-exchange-show').attr('id');
        //console.log(exchangeid);
        $.ajax({
            url : '/GoldShop/useMagicCard',
            type : 'post',
            dataType : 'html',
            data : {
                id : exchangeid
            }
        })
    })
});
