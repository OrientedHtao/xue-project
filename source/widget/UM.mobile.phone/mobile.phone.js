/**
 * @description : for register
 * @author GeYuanjun (geyuanjun@100tal.com)
 * @modify 2015-09-17 11:04
 * @version
 */
 var xue =xue || {};

     xue.formCheck = xue.formCheck || {};

!function(){
  var fCheck = xue.formCheck;

  /* 获取form表单元素 */
  fCheck.param = {
    form         : '#form-register',
    phone        : '#phone',
    password     : '#password',
    verifiCode   : '#verificationCode',
    phoneCode    : '#phonecode',
    phoneTip     : '.phone-tip',
    phoneWarn    : '.phone-warning',
    passwordTip  : '.pass-tip',
    passwordWarn : '.pass-warning',
    passSecurity : '.security',
    verification : '#verificationImg',
    veriTip      : '.verification-tip',
    selectWarn   : '.select-warning',
    tPhoneCode   : '#tips-phonecode',
    cPhone       : 0,
    cPass        : 0,
    cImg         : 0,
    cMessage     : 0
  }; 



  /**
   * [setTips description]
   * @param {string} select [标签选择]
   * @param {string} tips   [页面显示的提示信息]
   * @description  设置提示(未经ajax认证时调用)
   */
  fCheck.setTips = function(select, tips){
    $(select).css({
      'background': 'url("img/warning.png") no-repeat 10px 5px',
      'padding-left':'32px' 
    }).html(tips);
  };

  /**
   * [clearTips description]
   * @param  {string} select [标签选择]
   * @return {[type]} none   [description]
   * @description  输入正确时，清除提醒
   */
  fCheck.clearTips = function(select){
    $(select).css({
      'background':'none'
    }).html(null);
  };


  /**
   * [checkPhone description]
   * @param  {string} phoneTip  [默认提示选择器(例如输入框内的'请输入手机号')]
   * @param  {string} phoneWarn [根据输入的手机号码的不同来展现不同提示的标签选择器]
   * @param  {string} value     [输入框内的值]
   * @return {boolean}          [手机验证的结果(只返回true,方便最后点击'立即注册'时验证)]
   * @description     检验输入的手机号码是否符合要求
   */
  fCheck.checkPhone = function(phoneTip,phoneWarn,value){
    /* 验证手机号码 */
    if( !value ){
      /* 未输入任何字符 */
      $(phoneTip).show();
      fCheck.setTips(phoneWarn,"请输入手机号");
    } else {
      /* 对手机号码进行验证 */
      var isPhone = (/^(13|15|18|14|17)[0-9]{9}$/.test(value) ? true : false);
      var is11 = (/^\d{11}$/.test(value) ? true : false);

      if(!is11){
        /* 非11位数字组成 */
        fCheck.setTips(phoneWarn,"手机号由11位数字组成");
        fCheck.param.cPhone = 0;
      }else if( isPhone ){
        /* 手机号码输入正确(两种操作) */
        fCheck.phoneAjax();
      }else{
        fCheck.setTips(phoneWarn,'不支持该手机号号段');
        fCheck.param.cPhone = 0;
      }
    }
  };

  /**
   * [phoneAjax description]
   * @param  {string} value [手机输入框内的值]
   * @return {boolean}      [返回true或false方便进行验证]
   * @description           与后台连接检验输入的手机号码是否符合要求
   */
  fCheck.phoneAjax = function () {
    /* 利用ajax确定是否已经注册(未验证) */
     $.ajax({
      type:"POST",
      url:"/Reg/isPhoneUseable",
      data: 'phone=' + $('#phone').val(),
      dataType: "json",
      timeout: 7000,
      async: false,
      success: function(result) {
        
        if (result.sign != 1) {
          
          fCheck.setTips(fCheck.param.phoneWarn, '该手机号已被注册，您可以直接去登录');
          fCheck.param.cPhone = 0;
        }else{
          fCheck.clearTips(fCheck.param.phoneWarn);
          fCheck.param.cPhone = 1;
        }
      },
      error: function() {
        alert('数据读取错误,请重试..');
        return false;
      }
     });
  };
  
  // 更新验证码图片
  fCheck.changeVerificationImg = function (imgId) {
    var newVerificationImg = '/Verifications/show?' + fCheck.generateMixed(12);
    $('img[id="' + imgId + '"]').attr('src', newVerificationImg);
  }
  // 生成随机字符串
  fCheck.generateMixed = function (n) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 35);
      res += chars[id];
    }
    return res;
  }

  //验证校验码是否正确(模拟验证1234)
  fCheck.imgcode = function() {
    var input = $(fCheck.param.verifiCode),
      v = input.val();

    if (v == '') {
      fCheck.setTips('.veri-warning','请输入右侧验证码');
      fCheck.param.cImg = 0;
    }else if(/^\w{4}$/.test(v)){
      /* 调用ajax取值 */
      fCheck.clearTips('.veri-warning');
      fCheck.imgCodeAjax();
      
    }else{
      fCheck.setTips('.veri-warning','请输入正确的验证码');
      fCheck.param.cImg = 0;
    }
  };

  /* 验证图片验证码 */
  fCheck.imgCodeAjax = function(){
     $.ajax({
      type:"POST",
      url:"/Reg/getVerificationCode",
      data: 'verifyCode=' + $('#verificationCode').val(),
      dataType: "json",
      timeout: 7000,
      async: false,
      success: function(result) {
        /* 填写的信息验证不通过 */
        if (result.sign != 1) {
          fCheck.setTips('.veri-warning','网站验证码填写错误');
          fCheck.param.cImg = 0;
        }else{
          fCheck.clearTips('.veri-warning');
          fCheck.param.cImg = 1;
        }
      },
      error: function() {
        alert('数据读取错误,请重试..');
        return false;
      }
     });
  };

  /* 校验短信验证码 */
  fCheck.phonecode = function(param){
        var box = $(param);
        var val = box.val();
        if(val == undefined){
            fCheck.setTips(id, '手机验证码不能为空');
        }else{
            if(val.length == 6 && /^[1-9]\d*|0$/.test(Number(val))){

              /* 验证手机短信验证码 */
               
        fCheck.clearTips('#tips-phonecode');
        fCheck.param.cMessage = 1;
            }else{
                fCheck.setTips('#tips-phonecode', '手机验证码不正确');
        fCheck.param.cMessage = 0;
            }
        }
        
    };
    
    fCheck.phonecodeAjax = function(btn){
      var that = btn;
    $.ajax({
      type: "POST",
      url: "/Reg/getPassCode",
      data: 'phone=' + $('#phone').val(),
      dataType: "json",
      timeout: 7000,
      async: false,
      success: function (result) {

        if(!result.sign){
          fCheck.clearTips('#tips-phonecode');
          fCheck.setTips('#tips-phonecode',result.msg);
        }else{
          /* 短信发送成功提醒 */
          $('#tips-phonecode').css({'padding-left': '0', 'width': '300px', 'background': 'none'});
          $('#tips-phonecode').text('由于运营商原因，手机短信可能会有延迟，请您耐心等待');
          /* 操作按钮文本显示 */
          $(that).text("60秒后重新获取");
          var time = 60;
          that.timer = setInterval(function(){
                if(time > 0){
                  time--;
                  $(that).text(time + '秒后重新获取');
                }else{
                  $(that).text('获取短信验证码');
                  clearInterval(that.timer);
                  that.timer = null;
                  $(that).removeClass('btn_in_use');
                }
              }, 1000);

          $('#phonecode').focus().val('');
        }
      },
      error: function () {
        alert('数据读取错误,请重试..');
        return false;
      }
    });
    };

    /* 点击"保存"按钮时检查错误信息 */
    fCheck.isError = function(e){
    fCheck.checkPhone(fCheck.param.phoneTip,fCheck.param.phoneWarn,$("#phone").val());
    fCheck.imgcode();
    var value = $(fCheck.param.password).val();
    if(value.length > 0 && value.length < 6 ){
      fCheck.setTips(fCheck.param.passwordWarn,'密码不能少于6位字符');
    }else if(value.length == 0){
      fCheck.setTips(fCheck.param.passwordWarn,'请输入密码');
    }
    var param = fCheck.param;
      if( param.cPhone && param.cPass && param.cGrade && param.cImg ){
        return false;
      }else{
        return true;
      }
    }

  /* 手机号码输入框的操作 */
  $(fCheck.param.phone).focus(function(){
    $(fCheck.param.phoneTip).hide();
    fCheck.clearTips(fCheck.param.phoneWarn);
  });

  $(fCheck.param.phone).blur(function(){
    var value =  $("#phone").val();
    fCheck.checkPhone(fCheck.param.phoneTip,fCheck.param.phoneWarn,value);
    if(fCheck.param.cPhone == 1){
      $('#phone').css('border','1px solid #68c04a');
    }else{$('#phone').css('border','1px solid #eaeaea');}
  });

  /* 密码框的操作 */
  $(fCheck.param.password).on('focus',function(){
    $(fCheck.param.passwordTip).hide();
    fCheck.clearTips(fCheck.param.passwordWarn);
  });

  $(fCheck.param.password).blur(function(e){
    var value = $(fCheck.param.password).val();
    if(value.length > 0 && value.length < 6 ){
      fCheck.setTips(fCheck.param.passwordWarn,'密码不能少于6位字符');
    }else if(value.length == 0){
      fCheck.setTips(fCheck.param.passwordWarn,'请输入密码');
      $(fCheck.param.passwordTip).show();
    }
    if(fCheck.param.cPass == 1){
      $('#password').css('border','1px solid #68c04a');
    }else{
      $('#password').css('border','1px solid #eaeaea');
    }  
  });

  /* 点击切换验证码 */
  $("#verificationImg").on('click',function(){
    fCheck.changeVerificationImg("verificationImg");
  })

  $("#verificationCode").on('focus',function(){
    $(fCheck.param.veriTip).hide();
    fCheck.clearTips('.veri-warning');
  })

  $("#verificationCode").on('blur',function(){
    var value = $("#verificationCode").val();
    if(value == ''){$(fCheck.param.veriTip).show();}
    fCheck.imgcode();
    if(fCheck.param.cImg == 1){
      $('#verificationCode').css('border','1px solid #68c04a');
    }else{
      $('#verificationCode').css('border','1px solid #eaeaea');
    }
  });

  /* 获取手机验证码 */
  $('#vcode').off('click').on('click',function(){
    if(!$(this).hasClass('btn_in_use')){
      fCheck.checkPhone(fCheck.param.phoneTip,fCheck.param.phoneWarn,$("#phone").val());    
      fCheck.imgcode();
      var that = this;
      if(fCheck.param.cImg && fCheck.param.cPhone){
        $(that).addClass('btn_in_use');
        fCheck.phonecodeAjax(that); 
      }
    }
  });

  $('#phonecode').on('blur',function(){
    fCheck.phonecode('#phonecode');
  });

  /* 手机验证码输入框的操作 */
  $("#phonecode").on("focus",function(){
    $('.phonecode-tip').hide();
    fCheck.clearTips('#tips-phonecode');
  })


  $("#phonecode").on("blur",function(){
    var value = $('#phonecode').val();
    if(value.length == 0){
          $('.phonecode-tip').show();
        }
  })

  /* 判断是否可以点击操作"完成"按钮 */

  $("#form_submit").on('click',function(e){
    var isError = fCheck.isError(e);
    if(isError){
      return false;
    }else{
      fCheck.phonecode('#phonecode');
      if( fCheck.param.cMessage){
        /* 正常注册 */
         $.ajax({
          type:"GET",
          url:"/Reg/registerOprea",
          dataType: "json",
          data: 'phone=' + $('#phone').val() + '&password=' + $('#password').val() + '&imgcode=' + $('#verificationCode').val()+'&phonecode='+$('#phonecode').val(),
          timeout: 7000,
          success: function(result) {
            /* 填写的信息验证不通过 */
            if(result.sign == 1){
              window.location.href= '/Reg/RegSuc';
            }else{
              fCheck.setTips('#tips-phonecode',result.msg);
            }
          },
          error: function() {
            alert('数据读取错误,请重试..');
            return false;
          }
         });
      }else{
        return false;
      }
    }
  });
  fCheck.changeVerificationImg("verificationImg");
}();




