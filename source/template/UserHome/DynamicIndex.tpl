<!-- 公共头部 -->
<link rel="import" href="../Layer/layer.UserHome.head.tpl?__inline">
<!-- 学习中心区域 -->
<div class="container top m20">
    <div class="row">
        <div class="col-md-10 wrap-body">
            <!-- *********************** 内容区域开始 *********************** -->

            <ul class="nav nav-tabs">  
                <li role="presentation" class="active"><a href="/pages/UserHome/DynamicIndex.html">新鲜事</a></li>
                <li><a href="/pages/UserHome/DynamicContact.html">@我的</a></li>
                <li><a href="/pages/UserHome/DynamicAttention.html">关注的人</a></li>
                <li class="pull-right">
                    <a href="#" class="btn btn-danger" id="freshPost" data-toggle="modal" data-target="#fresh-sendInfo-box" >
                        <i class="fa fa-plus"></i> 发新鲜事
                    </a>
                </li>                                
            </ul>







            <div class="row">              
                <div class="col-md-2 wrap w120">                 
                    <div class="panel panel-default wrap h630">
                        <div class="list-group top m20">
                            <a href="/pages/UserHome/DynamicIndex.html" class="list-group-item active">我关注的</a>
                            <a href="/pages/UserHome/DynamicMyself.html" class="list-group-item">我自己的</a>

                        </div>   
                    </div>
                </div>
                <div class="col-md-10 wrap w930">
                    <!--新鲜事筛选tab标签开始-->
                    <div class="filter-public-tab">
                       <span class="filter-text-style">筛选：</span>
                       <div class="filter-nav-list">
                          <ul id="fresh-filter-nav">
                              <li class="current" data-params="category=1" data-type="0"><a href="javascript:void(0)">全部</a></li>
                              <li data-type="20"><a href="javascript:void(0)">题目</a></li>
                              <li data-type="2"><a href="javascript:void(0)">图文</a></li>
                              <li data-type="21"><a href="javascript:void(0)">视频</a></li>
                          </ul>
                       </div>
                    </div>
                    <!--新鲜事筛选tab标签结束-->   
                    <div class="panel panel-default">
                        <div class="panel-body fresh-main-wrapper" style="padding:0">
                            <link rel="import" href="../../widget/Public.Dynamic/index.tpl?__inline">
                        </div>                     
                    </div>
                </div>
            </div>


            <!-- *********************** 内容区域结束 *********************** -->
        </div>
        <div class="col-md-2 col-sm-2 wrap-side">
            <link rel="import" href="../../widget/UserHome.sidebar/index.tpl?__inline">
        </div>
    </div>
</div>

<!-- 页面配置 -->
<script>
    var PAGE_CONFIG = {
        ID: 'Dynamic',
        MODULE: 'UserHome',
        TITLE: '新鲜事'
    };

</script>
<!--ignore-->

<!-- 公共底部 -->
<link rel="import" href="../Layer/layer.UserHome.foot.tpl?__inline">

