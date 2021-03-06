<!--
  @require personalCenter.less
  @require personalCenter.js
  @require ../Module.Pagination/pagination.js
-->

<div class="centerHeader-office-background">
    <div class="centerHeader-ib">
        <div class="centerHeader-img">
            <div class="centerHeader-img-head">
                <!--title属性仅在学生主页进行设置-->
                <div class="centerHeader-office-img-level" title="学而思网校官方账号">
                    <img src="img/level.png" alt="" class="level-img" />
                </div>
            </div>
        </div>
        
        <!--1、官方账号-->
        <div class="centerHeader-intro-office">产品经理之殇</div>
        <!-- 官方账号介绍栏 -->
        <div class="centerHeader-selfintro">发布网校最新产品上线信息，吐槽在线学习最新热点</div>

        <!--1、未关注时-->
        <div class="centerHeader-notFoucs ui_follow" data-url="/data/Module.Follow/follow1.json" state="1"><a class="centerHeader-notFoucs-btn btn btn-warning follow_add">+关注</a></div>

        <!--2、已经关注-->
        <div class="centerHeader-alFocus hide ui_follow"><span class="centerHeader-alFocus-btn btn btn-default">已关注</span><a href="###" class="centerHeader-willFocus-btn btn follow_cancel">取消关注</a></div>
    </div>
    <link rel="import" href="../../widget/Mall.personCenter/tab-office.tpl?__inline">
<!--
    <div class="row bottom m20">
        <div class="col-md-9 top m20">
            <link rel="import" href="../../widget/Public.Dynamic/dynAttention.tpl?__inline">
        </div>
        <div class="col-md-3 top m20">
            <div class="center-left-m">
                <link rel="import" href="center-info.tpl?__inline">
                <link rel="import" href="center-visit.tpl?__inline">
            </div>
        </div>
    </div>
-->
</div>
