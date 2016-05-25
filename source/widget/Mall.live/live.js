/**
 * Created by yangmengyuan on 15/10/22.
 */
$(function(){
    var $body = $('body');
    var $liveScrollBtn = $('.live-scroll-btn-container li');
    $liveScrollBtn.on('click',function(e){
        var $target = $(e.target);
        var index = $target.index();
        $liveScrollBtn.removeClass('live-scroll-btn-on').eq(index).addClass('live-scroll-btn-on');
        $('.live-scroll-box-container').animate({top:(-1*291*index) + 'px'},300)
    });
    $('.problem .answer').eq(0).css({display:'block'});
    $('.problem .title').each(function(index){
        $(this).bind('mouseenter',function(){
            $('.answer').css({display:'none'})
            .eq(index).css({display:'block'})
        })
    })
    var $livecourseshowtitle = $('.live-course-show-title');
    $livecourseshowtitle.each(function(){
        var maxwidth=16;
        if($(this).text().length>maxwidth){
            $(this).text($(this).text().substring(0,maxwidth));
            $(this).html($(this).html()+'…');
        }
    });
    var $liveCourseContent = $('.live-course-content');
    $liveCourseContent.each(function(){
        var maxwidth=47;
        if($(this).text().length>maxwidth){
            $(this).text($(this).text().substring(0,maxwidth));
            $(this).html($(this).html()+'…');
        }

    });

    $('body').on('click', '.live-order', function () {
        var liveOrderId = $(this).closest('.live-card').attr('id'),
            url = $(this).closest('.live-card').attr('data-url'),
            timer;
        var t = $(this);
        $.ajax({
            url : '/Lecture/ajaxFollow/',
            type : 'post',
            dataType : 'json',
            data : {
                liveId: liveOrderId,
                url: url
            },
            success : function(msg,event){
                if(msg.sign == 2){
                    window.location.href = msg.msg;
                    return;
                }
                if(msg.sign == 1){
                    t.attr("data-target","#liveOrderSuccessModal");
                    liveOrderSuccessModal.showModal();
                    var tim = 5;
                    timer = setInterval(function(){
                        tim --;
                        $('.orderSuccessTip span').html(tim);
                        if(tim == 0){
                            $("#liveOrderSuccessModal").modal("hide");
                            clearInterval(timer);
                        }
                    },1000);
                    t.closest('."live-course-title').addClass('success_join')
                    t.html("已预约，请耐心等待")
                }
                if(msg.sign == 3 || msg.sign==0){
                    t.attr("data-target","#liveOrderFailModal");
                    liveOrderFailModal.showModal();
                    var tim = 5;
                    timer = setInterval(function(){
                        tim --;
                        $('.orderFailTip span').html(tim);
                        if(tim == 0){
                            $("#liveOrderFailModal").modal("hide");
                            clearInterval(timer);
                        }
                        $('#liveOrderFailModal').on('hidden.bs.modal',function(){
                            clearInterval(timer);
                        });
                    },1000);
                }
            }
        });
    });

    var liveOrderSuccessModal = liveOrderSuccessModal || {};

    liveOrderSuccessModal.showModal = function(con){
        var that = $(this), data = that.data();
        var con = "<img src='/static/img/orderSuccess.png'><span class='orderSuccessTip'><span>5</span>秒钟后关闭</span>";
        //console.log(data);
        createModal.show({
            id : 'liveOrderSuccessModal',
            width : '560',
            title : "预约直播",
            cls : "liveOrderSuccessModal aaa ccc",
            content : con
        });
        $('#liveOrderSuccessModal').modal({backdrop: 'static', keyboard: false})

    };

    var liveOrderFailModal = liveOrderFailModal || {};

    liveOrderFailModal.showModal = function(timer){
        var that = $(this), data = that.data();
        var con = "<img src='/static/img/orderFail.png'><span class='orderFailTip'><span>5</span>秒钟后关闭</span>";
        //console.log(data);
        createModal.show({
            id : 'liveOrderFailModal',
            width : '560',
            title : "预约直播",
            cls : "liveOrderFailModal aaa ccc",
            content : con
        });
        $('#liveOrderFailModal').modal({backdrop: 'static', keyboard: false})

    };

    var $lrtli = $(".live-rank-title li");

    $lrtli.on('click', function(){
        var that = $(this);
        that.addClass("current").siblings().removeClass("current");
        $(".live-hidden").hide().eq($(this).index()).show();
        var url = that.attr('data-url');
        if(url == '/MyOrders/ajaxInvoiceOrder'){
            liveList(url);
        }else{
            liveTab();
        }
    });
    $('.live-rank-title li:first').click();

    function liveList(url){

        $.ajax({
            type: "get",
            url: url,
            dataType: "html",
            data:{},
            success: function(list){
                var list = $.trim(list);
                if(list.substr(0,1)=='<'){
                    var box = $('.live-begin');
                    box.html(list);
                }else{
                    if(list.substr(0,4)=='http' || list.substr(0,1)=='/'){
                        window.location.href = list;
                        return false;
                    }
                }
            },
            error:function(){
                alert("异步失败");
            }
        });
    };

    function liveTab(){
        $.ajax({
            type: "get",
            url: "ajaxInvoiceApplyList",
            dataType: "html",
            data:{},
            success: function(list){
                var list = $.trim(list);
                if(list.substr(0,1)=='<'){
                    var box = $('.live-playback'),
                        content = $('.live-begin');
                    box.html(list).show();
                    content.css({'display':'none'});
                }else{
                    if(list.substr(0,4)=='http' || list.substr(0,1)=='/'){
                        window.location.href = list;
                        return false;
                    }
                }
            },
            error:function(){
                alert("异步失败");
            }
        });
    };

    
   


    $('.bg-red').html('直播中,立即进入');
    $('.bg-yellow').html('立即预约直播');
    $('.bg-blue').html('观看直播回放');

    $('.ui-pages').pages({
        total: 16, // 总记录数
        size: 16, // 每页显示记录数
        index: 1, // 当前页
        // 点击分页时的回调，返回被点击的页数
        click: function (index) {
            $.ajax({
                type: "POST",
                url: "/MyOrders/ajaxInvoiceApplyList",
                dataType: "html",
                data: 'curpage=' + index,
                success: function (objects) {
                    if (objects.sign === 2) {
                        window.location.href = objects.msg;
                    }
                    var box = $('#invoiceTable');
                    box.html(objects);
                },
                error: function () {
                    alert("异步失败");
                }
            });
        }
    });

});